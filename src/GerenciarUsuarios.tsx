import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { UsuarioType } from '../utils/UsuarioType';
import { ShieldCheck, User, UserCog } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL;

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioType[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsuarios() {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/api/usuarios`);
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

  async function handleRoleChange(userId: number, newRole: string) {
    if (!confirm(`Deseja alterar a permissão deste usuário para "${newRole}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/usuarios/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo: newRole }),
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

  const roleIcons: Record<string, React.ElementType> = {
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usuarios.map(user => {
              const Icon = roleIcons[user.tipo] || User;
              return (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex items-center gap-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      <Icon size={14} />
                      {user.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={user.tipo}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="form-input py-1"
                    >
                      <option value="candidato">Candidato</option>
                      <option value="lider">Líder</option>
                      <option value="admin">Admin</option>
                    </select>
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