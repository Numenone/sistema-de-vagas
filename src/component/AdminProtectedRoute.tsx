import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useUsuarioStore } from '../context/UsuarioContext';

export default function AdminProtectedRoute() {
  const { usuario } = useUsuarioStore();
  const location = useLocation();

  // Se o usuário não estiver logado, redireciona para a página de login,
  // guardando a página que ele tentou acessar para redirecioná-lo de volta depois.
  if (!usuario.id) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se o usuário estiver logado, mas não for do tipo 'admin',
  // redireciona para a página inicial.
  if (usuario.tipo !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Se o usuário for um admin, permite o acesso à rota.
  // O <Outlet /> renderiza o componente filho da rota (Dashboard, GerenciarVagas, etc.).
  return <Outlet />;
}