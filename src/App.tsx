import { useEffect, useState } from "react";
import { CardVaga } from "./component/CardVaga";
import { InputPesquisa } from "./component/InputPesquisa";
import type { VagaType } from "./utils/VagaType";
import { FeedAtividades } from "./component/FeedAtividades"; 
import type { HabilidadeType } from "./utils/HabilidadeType";
import React from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [vagas, setVagas] = useState<VagaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  
  // Unifica todos os filtros em um único estado
  const [filtros, setFiltros] = useState({
    termo: "",
    salario: "",
    empresa: "",
    modalidade: "",
    tipoContrato: "",
    habilidades: [] as string[],
  });

  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [empresas, setEmpresas] = useState<string[]>([]);
  const [habilidades, setHabilidades] = useState<HabilidadeType[]>([]);

  // Este useEffect busca as vagas sempre que um filtro ou a página mudar
  useEffect(() => {
    const fetchVagas = async () => {
      setLoading(true);
      try {
        // Constrói a URL com os parâmetros de filtro
        const params = new URLSearchParams();
        if (filtros.termo) params.append('q', filtros.termo);
        if (filtros.salario) params.append('salario', filtros.salario);
        if (filtros.empresa) params.append('empresaNome', filtros.empresa);
        if (filtros.modalidade) params.append('modalidade', filtros.modalidade);
        if (filtros.tipoContrato) params.append('tipoContrato', filtros.tipoContrato);
        if (filtros.habilidades.length > 0) {
          params.append('habilidades', filtros.habilidades.join(','));
        }
        params.append('page', pagination.currentPage.toString());
        
        const response = await fetch(`${apiUrl}/api/vagas?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Falha ao carregar vagas.');
        }
        const { vagas: dados, totalPages, currentPage } = await response.json();
        setVagas(dados);
        setPagination({ totalPages, currentPage });
      } catch (error) {
        console.error("Erro ao buscar vagas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVagas();
  }, [filtros, pagination.currentPage]);

  // useEffect com DEBOUNCE para o filtro de texto
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, currentPage: 1 })); // Apenas reseta a página, a busca é acionada pela mudança em 'filtros'
    }, 500); // Atraso de 500ms

    return () => clearTimeout(timer); // Limpa o timer se o usuário digitar novamente
  }, [filtros.termo]);

  // Busca a lista de empresas uma única vez para popular o dropdown (usando o endpoint dedicado)
  useEffect(() => {
    const fetchEmpresas = async () => {
      const response = await fetch(`${apiUrl}/api/empresas`);
      const dados = await response.json();
      const empresasUnicas = Array.from(new Set(dados.map((empresa: { nome: string }) => empresa.nome))) as string[];
      setEmpresas(empresasUnicas);
    }
    fetchEmpresas();
  }, [])

  // Busca a lista de habilidades uma única vez
  useEffect(() => {
    const fetchHabilidades = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/habilidades`);
        const data = await response.json();
        setHabilidades(data);
      } catch (error) {
        console.error("Erro ao buscar habilidades:", error);
      }
    }
    fetchHabilidades();
  }, []);

  const handleFiltroChange = (name: string, value: string) => {
    // Para selects, a busca é imediata ao mudar o estado
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reseta para a página 1 ao aplicar filtros
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const limparFiltros = () => {
    setFiltros({ termo: "", salario: "", empresa: "", modalidade: "", tipoContrato: "", habilidades: [] });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleHabilidadeChange = (habilidadeNome: string) => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    setFiltros(prev => {
      const novasHabilidades = prev.habilidades.includes(habilidadeNome)
        ? prev.habilidades.filter(h => h !== habilidadeNome)
        : [...prev.habilidades, habilidadeNome];
      return { ...prev, habilidades: novasHabilidades };
    });
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encontre a Vaga Perfeita para Você
          </h1>
          <p className="text-xl mb-8">
            Conectamos talentos incríveis com oportunidades excepcionais
          </p>
          
          <InputPesquisa 
            onSearch={(termo) => setFiltros(prev => ({ ...prev, termo }))}
            onInputChange={(termo) => setFiltros(prev => ({ ...prev, termo }))} // Debounce é acionado aqui
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto p-6">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">Filtrar Vagas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Faixa Salarial</label>
              <select 
                value={filtros.salario}
                onChange={(e) => handleFiltroChange('salario', e.target.value)}
                className="form-input"
              >
                <option value="">Todos os salários</option>
                <option value="0-3000">Até R$ 3.000</option>
                <option value="3000-6000">R$ 3.000 - R$ 6.000</option>
                <option value="6000-10000">R$ 6.000 - R$ 10.000</option>
                <option value="10000-15000">R$ 10.000 - R$ 15.000</option>
                <option value="15000">Acima de R$ 15.000</option>
              </select>
            </div>
            

            <div>
              <label className="block text-sm font-medium mb-2">Empresa</label>
              <select 
                value={filtros.empresa}
                onChange={(e) => handleFiltroChange('empresa', e.target.value)}
                className="form-input"
              >
                <option value="">Todas as empresas</option>
                {empresas.map(empresa => (
                  <option key={empresa} value={empresa}>{empresa}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Modalidade</label>
              <select 
                value={filtros.modalidade}
                onChange={(e) => handleFiltroChange('modalidade', e.target.value)}
                className="form-input"
              >
                <option value="">Todas</option>
                <option value="Remoto">Remoto</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo de Contrato</label>
              <select 
                value={filtros.tipoContrato}
                onChange={(e) => handleFiltroChange('tipoContrato', e.target.value)}
                className="form-input"
              >
                <option value="">Todos</option>
                <option value="CLT">CLT</option>
                <option value="PJ">PJ</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Habilidades</label>
            <div className="flex flex-wrap gap-2">
              {habilidades.map(habilidade => (
                <button
                  key={habilidade.id}
                  onClick={() => handleHabilidadeChange(habilidade.nome)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filtros.habilidades.includes(habilidade.nome)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {habilidade.nome}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {vagas.length > 0 ? `${vagas.length} vaga(s) encontrada(s)` : ''}
            </div>
            <button onClick={limparFiltros} className="btn-secondary">
              Limpar Filtros
            </button>
          </div>

          {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Buscando vagas...</p>
              </div>
            ) : vagas.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Nenhuma vaga encontrada</h3>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou buscar por outros termos
                </p>
                <button onClick={limparFiltros} className="mt-4 btn-primary">Limpar Filtros</button>
              </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Vagas Disponíveis</h2>
                {vagas.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">Nenhuma vaga encontrada</h3>
                    <p className="text-gray-600">Tente ajustar os filtros ou buscar por outros termos.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vagas.map(vaga => (
                      <CardVaga key={vaga.id} data={vaga} />
                    ))}
                  </div>
                )}
                {vagas.length > 0 && pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <PaginationControls currentPage={pagination.currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
                  </div>
                )}
              </div>

          <div className="lg:col-span-1">
            <FeedAtividades />
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{loading ? '...' : vagas.length}</div>
              <div className="text-gray-600">Vagas Ativas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">{empresas.length}</div>
              <div className="text-gray-600">Empresas Parceiras</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600">Candidatos Contratados</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente para os controles de paginação
function PaginationControls({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>
      {pageNumbers.map(number => (
        <button key={number} onClick={() => onPageChange(number)} className={`px-4 py-2 rounded-md text-sm ${currentPage === number ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
          {number}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Próxima
      </button>
    </nav>
  );
}