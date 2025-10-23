import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { UsuarioType } from '../utils/UsuarioType';
import { useUsuarioStore } from '../context/UsuarioContext';
import { ShieldCheck, User, UserCog } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

// Define user roles for better type safety and reusability.
const USER_ROLES = ['candidato', 'lider', 'admin'] as const;
type UserRole = typeof USER_ROLES[number];

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);
  const [loading, setLoading] = useState(true);
  const { usuario: adminUsuario, fetchAutenticado } = useUsuarioStore(); // Adicionar fetchAutenticado

  async function fetchUsuarios() {
    try {
      setLoading(true);
      const response = await fetchAutenticado(`${apiUrl}/api/admin/usuarios`); // Usar a nova rota e o fetch autenticado
      if (!response.ok) throw new Error('Falha ao buscar usuários');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      toast.error('Erro ao carregar usuários.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function handleRoleChange(userId: number, newRole: UserRole) {
    if (userId === adminUsuario.id) {
      toast.warning('Você não pode alterar sua própria permissão.');
      return;
    }

    if (!confirm(`Deseja alterar a permissão deste usuário para "${newRole}"?`)) {
      return;
    }

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/admin/usuarios/${userId}`, { // Usar a nova rota e o fetch autenticado
        method: 'PATCH',
        body: JSON.stringify({ tipo: newRole as string }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar permissão.');

      toast.success('Permissão do usuário atualizada com sucesso!');
      // Atualiza a lista localmente para refletir a mudança
      setUsuarios(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, tipo: newRole } : user
        )
      );
    } catch (error) {
      toast.error('Erro ao atualizar permissão.');
      console.error(error);
    }
  }

  async function handleStatusChange(userId: number, currentStatus: boolean) {
    if (userId === adminUsuario.id) {
      toast.warning('Você não pode desativar sua própria conta.');
      return;
    }

    const action = currentStatus ? 'desativar' : 'ativar';
    if (!confirm(`Deseja ${action} este usuário?`)) return;

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/admin/usuarios/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ ativo: !currentStatus }),
      });

      if (!response.ok) throw new Error('Falha ao atualizar status.');

      toast.success(`Usuário ${action} com sucesso!`);
      setUsuarios(prev => prev.map(user => user.id === userId ? { ...user, ativo: !currentStatus } : user));
    } catch (error) {
      toast.error(`Erro ao ${action} usuário.`);
    }
  }

  const roleIcons: Record<UserRole, React.ElementType> = {
    candidato: User,
    lider: UserCog,
    admin: ShieldCheck,
  };

  if (loading) return <div className="p-6">Carregando usuários...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Usuários</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissão Atual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alterar Permissão</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map(user => {
              const Icon = roleIcons[user.tipo] || User;
              return (
                <tr key={user.id}>
                  <td className={`px-6 py-4 whitespace-nowrap ${!user.ativo ? 'text-gray-400' : ''}`}>{user.nome}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${!user.ativo ? 'text-gray-400' : ''}`}>{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center gap-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.ativo ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon size={14} />
                      {user.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={user.tipo}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                      className="form-input py-1"
                      disabled={user.id === adminUsuario.id} // Disable changing own role
                    >
                      {USER_ROLES.map(role => (
                        <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleStatusChange(user.id, user.ativo)}
                      className={user.ativo ? 'btn-danger' : 'btn-success'}
                      disabled={user.id === adminUsuario.id}>
                      {user.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}