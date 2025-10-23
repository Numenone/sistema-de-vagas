import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuarioStore } from '../context/UsuarioContext';
import { Bell, BellOff } from 'lucide-react';
import { subscribeToPush } from '../utils/push'; // This path is now correct

type NavLink = {
  to: string;
  label: string;
  className: string;
};

const navLinksPorTipo: Record<string, NavLink[]> = {
  candidato: [
    { to: '/minhasCandidaturas', label: 'Minhas Candidaturas', className: 'bg-gray-600 hover:bg-gray-700' },
    { to: '/favoritos', label: 'Favoritos', className: 'bg-pink-600 hover:bg-pink-700' },
  ],
  lider: [
    { to: '/empresa/editar', label: 'Editar Empresa', className: 'bg-blue-600 hover:bg-blue-700' },
    { to: '/empresa/candidaturas', label: 'Candidaturas', className: 'bg-purple-600 hover:bg-purple-700' },
    { to: '/empresa/vagas', label: 'Gerenciar Vagas', className: 'bg-green-600 hover:bg-green-700' },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', className: 'bg-blue-600 hover:bg-blue-700' },
    { to: '/admin/vagas', label: 'Vagas', className: 'bg-green-600 hover:bg-green-700' },
    { to: '/admin/candidaturas', label: 'Candidaturas', className: 'bg-purple-600 hover:bg-purple-700' },
    { to: '/admin/empresas', label: 'Empresas', className: 'bg-yellow-600 hover:bg-yellow-700' },
  ],
};

export default function UserMenu() {
  const { usuario, deslogaUsuario, unreadCount, fetchAutenticado } = useUsuarioStore();
  const navigate = useNavigate();
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    // This effect can be used to update the permission status if it changes in browser settings
    const interval = setInterval(() => {
      if (Notification.permission !== notificationPermission) {
        setNotificationPermission(Notification.permission);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [notificationPermission]);

  async function handleNotificationRequest() {
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission === 'granted') {
      subscribeToPush(fetchAutenticado); // This path is now correct
    }
  }

  function handleLogout() {
    if (confirm("Confirma saída do sistema?")) {
      deslogaUsuario();
      navigate("/login");
    }
  }

  const userLinks = navLinksPorTipo[usuario.tipo] || [];

  // A URL da foto de perfil vinda do Cloudinary já é completa.
  const fotoSrc = usuario.fotoPerfil 
    ? usuario.fotoPerfil 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nome)}&background=random`;

  return (
    <div className="flex items-center gap-4">
      <img 
        src={fotoSrc} 
        alt="Foto de perfil"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <span className="text-white font-bold">{usuario.nome}</span>
        <div className="text-xs text-gray-300 capitalize">{usuario.tipo}</div>
      </div>
      <Link to="/perfil/editar" className="text-white hover:text-blue-200 text-sm underline">
        Editar Perfil
      </Link>
      
      {/* Renderiza os links específicos do tipo de usuário */}
      {userLinks.map(link => (
        <Link key={link.to} to={link.to} className={`relative text-white px-3 py-2 rounded-lg ${link.className}`}>
          {link.to === '/minhasCandidaturas' && unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
              {unreadCount}
            </span>
          )}
          {link.label}
        </Link>
      ))}

      {notificationPermission === 'default' && (
        <button onClick={handleNotificationRequest} className="btn-secondary p-2" title="Ativar notificações">
          <BellOff size={18} />
        </button>
      )}
      {notificationPermission === 'granted' && (
        <Bell size={18} className="text-green-400" title="Notificações ativadas" />
      )}
      
      <button 
        onClick={handleLogout} 
        className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
      >
        Sair
      </button>
    </div>
  );
}