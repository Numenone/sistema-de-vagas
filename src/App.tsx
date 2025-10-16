import { useEffect, useState } from "react";
import { CardVaga } from "./component/CardVaga";
import { InputPesquisa } from "./component/InputPesquisa";
import type { VagaType } from "./utils/VagaType";
import React from 'react'

const apiUrl = import.meta.env.VITE_API_URL;

export default function App() {
  const [vagas, setVagas] = useState<VagaType[]>([]);
  const [vagasFiltradas, setVagasFiltradas] = useState<VagaType[]>([]);
  const [filtroSalario, setFiltroSalario] = useState<string>("");
  const [filtroEmpresa, setFiltroEmpresa] = useState<string>("");
  const [empresas, setEmpresas] = useState<string[]>([]);

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      const response = await fetch(`${apiUrl}/vagas?ativa=true&_expand=empresa`);
      if (!response.ok) {
        throw new Error('Falha ao carregar vagas.');
      }
      const dados = await response.json();

      if (Array.isArray(dados)) {
        setVagas(dados);
        setVagasFiltradas(dados);
        const empresasUnicas = Array.from(new Set(dados.map((vaga: VagaType) => vaga.empresa.nome))) as string[];
        setEmpresas(empresasUnicas);
      }
    } catch (error) {
      console.error("Erro ao buscar vagas:", error);
    }
  };

  const aplicarFiltros = () => {
    let vagasFiltradas = vagas;

    if (filtroSalario) {
      const [min, max] = filtroSalario.split("-").map(Number);
      vagasFiltradas = vagasFiltradas.filter(vaga => {
        if (max) {
          return vaga.salario >= min && vaga.salario <= max;
        } else {
          return vaga.salario >= min;
        }
      });
    }

    if (filtroEmpresa) {
      vagasFiltradas = vagasFiltradas.filter(vaga => 
        vaga.empresa.nome === filtroEmpresa
      );
    }

    setVagasFiltradas(vagasFiltradas);
  };

  const limparFiltros = () => {
    setFiltroSalario("");
    setFiltroEmpresa("");
    setVagasFiltradas(vagas);
  };

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
          
          <InputPesquisa setVagas={setVagasFiltradas} />
        </div>
      </section>

      <section className="max-w-7xl mx-auto p-6">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">Filtrar Vagas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Faixa Salarial</label>
              <select 
                value={filtroSalario}
                onChange={(e) => setFiltroSalario(e.target.value)}
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
                value={filtroEmpresa}
                onChange={(e) => setFiltroEmpresa(e.target.value)}
                className="form-input"
              >
                <option value="">Todas as empresas</option>
                {empresas.map(empresa => (
                  <option key={empresa} value={empresa}>{empresa}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button 
                onClick={aplicarFiltros}
                className="btn-primary flex-1"
              >
                Aplicar Filtros
              </button>
              <button 
                onClick={limparFiltros}
                className="btn-secondary"
              >
                Limpar
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {vagasFiltradas.length} vaga(s) encontrada(s)
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Vagas Disponíveis</h2>
          
          {vagasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Nenhuma vaga encontrada</h3>
              <p className="text-gray-600">
                Tente ajustar os filtros ou buscar por outros termos
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vagasFiltradas.map(vaga => (
                <CardVaga key={vaga.id} data={vaga} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{vagas.length}</div>
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