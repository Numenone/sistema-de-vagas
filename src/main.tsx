import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'

import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MinhasCandidaturas from './MinhasCandidaturas.tsx'
import Cadastro from './Cadastro.tsx'
import EditarPerfil from './EditarPerfil.tsx' // This line already exists and is correct.
import MinhasVagas from './MinhasVagas.tsx'
import EsqueciSenha from './EsqueciSenha.tsx'
import EmpresaPerfil from './EmpresaPerfil.tsx'
import MinhasVagasFavoritas from './MinhasVagasFavoritas.tsx'
import RedefinirSenha from './RedefinirSenha.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './component/Dashboard.tsx';
import GerenciarVagas from './component/GerenciarVagas.tsx';
import GerenciarCandidaturas from './component/GerenciarCandidaturas.tsx';
import AuthInitializer from './component/AuthInitializer.tsx';
import AdminProtectedRoute from './component/AdminProtectedRoute.tsx';

const rotas = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <AuthInitializer />
        <Layout />
      </>
    ),
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'detalhes/:vagaId', element: <Detalhes /> },
      { path: 'esqueci-senha', element: <EsqueciSenha /> },
      { path: 'redefinir-senha', element: <RedefinirSenha /> },
      { path: 'empresas/:id', element: <EmpresaPerfil /> },
      { path: 'empresa/vagas', element: <MinhasVagas /> },
      { path: 'perfil/editar', element: <EditarPerfil /> },
      { path: 'favoritos', element: <MinhasVagasFavoritas /> },
      { path: 'minhasCandidaturas', element: <MinhasCandidaturas /> },
      // Agrupando as rotas de admin sob a proteção
      { element: <AdminProtectedRoute />, children: [
          { path: 'admin/dashboard', element: <Dashboard /> },
          { path: 'admin/vagas', element: <GerenciarVagas /> },
          { path: 'admin/candidaturas', element: <GerenciarCandidaturas /> },
      ]}
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)