import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from '../context/UsuarioContext.js';
import type { EmpresaType } from '../utils/EmpresaType.js';
import { Building2, Edit, UserCog, Briefcase } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

type EmpresaComContagem = EmpresaType & {
  _count: {
    lideres: number;
    vagas: number;
  };
};

export default function GerenciarEmpresas() {
  const [empresas, setEmpresas] = useState<EmpresaComContagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchAutenticado } = useUsuarioStore();

  const fetchEmpresas = useCallback(async () => {
    try {
      setLoading(true);
      const url = searchTerm ? `${apiUrl}/api/admin/empresas?search=${encodeURIComponent(searchTerm)}` : `${apiUrl}/api/admin/empresas`;
      const response = await fetchAutenticado(url);
      if (!response.ok) throw new Error('Falha ao buscar empresas.');
      const data = await response.json();
      setEmpresas(data);
    } catch (error) {
      toast.error('Erro ao carregar empresas.');
    } finally {
      setLoading(false);
    }
  }, [fetchAutenticado, searchTerm]);

  useEffect(() => {
    // Debounce para evitar muitas requisições enquanto o usuário digita
    const handler = setTimeout(() => {
      fetchEmpresas();
    }, 300); // 300ms de debounce

    return () => {
      clearTimeout(handler);
    };
  }, [fetchEmpresas, searchTerm]);

  async function handleStatusChange(empresaId: number, currentStatus: boolean) {
    const action = currentStatus ? 'desativar' : 'ativar';
    if (!confirm(`Deseja ${action} esta empresa? As vagas dela também serão afetadas.`)) return;

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/admin/empresas/${empresaId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ ativo: !currentStatus }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar status.');

      toast.success(`Empresa ${action} com sucesso!`);
      setEmpresas(prev => prev.map(emp => emp.id === empresaId ? { ...emp, ativo: !currentStatus } : emp));
    } catch (error) {
      toast.error(`Erro ao ${action} a empresa.`);
    }
  }

    async function handleRestore(empresaId: number) {
    if (!confirm('Deseja reativar esta empresa? As vagas associadas não serão reativadas automaticamente.')) {
      return;
    }
    try {
      const response = await fetchAutenticado(`${apiUrl}/api/admin/empresas/${empresaId}/restore`, {
        method: 'PATCH',
      });
      if (response.ok) {
        toast.success('Empresa reativada com sucesso!');
        fetchEmpresas(); // Atualiza a lista
      } else {
        throw new Error('Falha ao reativar empresa.');
      }
    } catch (error) {
      toast.error('Erro ao reativar a empresa.');
    }
  }

  if (loading) {
    return <div className="p-6 text-center">Carregando empresas...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Empresas</h1>
        <Link to="/admin/empresas/criar" className="btn-primary">
          <Building2 className="mr-2" size={18} />
          Nova Empresa
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar empresas por nome ou descrição..."
          className="form-input w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Líderes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vagas Ativas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {empresas.map(empresa => (
              <tr key={empresa.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${!empresa.ativo ? 'opacity-50' : ''}`}>
                    <img className="h-10 w-10 rounded-full object-contain mr-4 border" src={empresa.logo || `https://ui-avatars.com/api/?name=${empresa.nome.charAt(0)}&background=random&color=fff`} alt={`Logo de ${empresa.nome}`} />
                    <div className="text-sm font-medium text-gray-900">{empresa.nome}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                  <UserCog size={16} /> {empresa._count.lideres}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                  <Briefcase size={16} /> {empresa._count.vagas}
                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${empresa.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {empresa.ativo ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex gap-2 justify-end">
                    <Link to={`/admin/empresas/${empresa.id}/editar`} className="btn-secondary">
                      <Edit size={16} className="mr-2" /> Editar
                    </Link>
                    {empresa.ativo ? (
                      <button onClick={() => handleStatusChange(empresa.id, true)} className="btn-danger">
                        Desativar
                      </button>
                    ) : (
                      <button onClick={() => handleRestore(empresa.id)} className="btn-success">
                        Restaurar
                      </button>
                    )}
                  </div>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}