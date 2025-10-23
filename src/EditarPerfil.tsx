import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUsuarioStore } from './context/UsuarioContext.js';

type Inputs = {
  nome: string;
  senha?: string;
  fotoPerfil?: FileList;
  confirmarSenha?: string;
};

const apiUrl = import.meta.env.VITE_API_URL;

export default function EditarPerfil() {
  const { usuario, token, logaUsuario, fetchAutenticado } = useUsuarioStore();
  const { register, handleSubmit, formState: { isDirty }, watch } = useForm<Inputs>({
    defaultValues: {
      nome: usuario.nome,
    }
  });
  const navigate = useNavigate();

  if (!usuario.id) {
    navigate('/login');
    return null;
  }

  const fotoAssistida = watch('fotoPerfil');

  async function onSubmit(data: Inputs) {
    if (!isDirty && !data.senha && (!data.fotoPerfil || data.fotoPerfil.length === 0)) {
      toast.info("Nenhuma alteração para salvar.");
      return;
    }

    if (data.senha && data.senha !== data.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    const formData = new FormData();
    formData.append('nome', data.nome);
    if (data.senha) {
      formData.append('senha', data.senha);
    }
    if (data.fotoPerfil && data.fotoPerfil.length > 0) {
      formData.append('fotoPerfil', data.fotoPerfil[0]);
    }

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/auth/usuarios/${usuario.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (response.ok) {
        const usuarioAtualizado = await response.json();
        if (token) {
          logaUsuario(usuarioAtualizado, token, true);
        }
        toast.success('Perfil atualizado com sucesso!');
        navigate('/');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao atualizar perfil.');
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro de conexão. Tente novamente.");
    }
  }
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Editar Perfil</h1>
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={fotoAssistida && fotoAssistida.length > 0
              ? URL.createObjectURL(fotoAssistida[0])
              : usuario.fotoPerfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=random`
            }
            alt="Foto de perfil" 
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <label htmlFor="fotoPerfil" className="btn-secondary cursor-pointer">Trocar Foto</label>
            <input type="file" id="fotoPerfil" className="hidden" {...register("fotoPerfil")} accept="image/*" />
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="nome" className="block mb-2 text-sm font-medium">Nome</label>
            <input type="text" id="nome" className="form-input" required {...register("nome")} />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">E-mail (não pode ser alterado)</label>
            <input type="email" id="email" className="form-input bg-gray-200 cursor-not-allowed" value={usuario.email} disabled />
          </div>
          <hr />
          <p className="text-sm text-gray-600">Deixe os campos de senha em branco se não quiser alterá-la.</p>
          <div>
            <label htmlFor="senha" className="block mb-2 text-sm font-medium">Nova Senha</label>
            <input type="password" id="senha" className="form-input" {...register("senha")} />
          </div>
          <div>
            <label htmlFor="confirmarSenha" className="block mb-2 text-sm font-medium">Confirmar Nova Senha</label>
            <input type="password" id="confirmarSenha" className="form-input" {...register("confirmarSenha")} />
          </div>
          <div className="flex gap-4">
            <button type="submit" className="btn-primary">
              Salvar Alterações
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}