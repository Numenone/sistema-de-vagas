import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'

import App from './App'
import Login from './Login'
import Detalhes from './Detalhes'
import MinhasCandidaturas from './MinhasCandidaturas'
import CandidaturasEmpresa from './CandidaturasEmpresa' // Importar a nova página
import PerfilCandidato from './PerfilCandidato'; // Importar a nova página de perfil
import PerfilLider from './PerfilLider'; // Importa a nova página
import Cadastro from './Cadastro'
import EditarPerfil from './EditarPerfil' // This line already exists and is correct.
import MinhasVagas from './MinhasVagas'
import EsqueciSenha from './EsqueciSenha'
import EditarEmpresa from './EditarEmpresa'; // Importa a nova página
import EmpresaPerfil from './EmpresaPerfil'
import EditarVagaAdmin from './EditarVagaAdmin'; // Importar a nova página
import EditarEmpresaAdmin from './EditarEmpresaAdmin' // Importar a nova página
import MinhasVagasFavoritas from './MinhasVagasFavoritas'
import CriarEmpresaAdmin from './CriarEmpresaAdmin'; // Adicionar a nova rota de criação
import RedefinirSenha from './RedefinirSenha'

import Layout from './Layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './component/Dashboard';
import GerenciarVagas from './component/GerenciarVagas';
import GerenciarCandidaturas from './component/GerenciarCandidaturas';
import GerenciarEmpresas from './component/GerenciarEmpresas'; // Importar a nova página
import GerenciarUsuarios from './component/GerenciarUsuarios';
import AuthInitializer from './component/AuthInitializer';
import AdminProtectedRoute from './component/AdminProtectedRoute';

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
      { path: 'empresa/editar', element: <EditarEmpresa /> }, // Adiciona a nova rota
      { path: 'empresa/candidaturas', element: <CandidaturasEmpresa /> },
      { path: 'candidatos/:id', element: <PerfilCandidato /> }, // Adicionar a nova rota
      { path: 'perfil/editar', element: <EditarPerfil /> },
      { path: 'perfil-lider', element: <PerfilLider /> }, // Adiciona a nova rota
      { path: 'favoritos', element: <MinhasVagasFavoritas /> },
      { path: 'minhasCandidaturas', element: <MinhasCandidaturas /> },
      // Agrupando as rotas de admin sob a proteção
      { element: <AdminProtectedRoute />, children: [
          { path: 'admin/dashboard', element: <Dashboard /> },
          { path: 'admin/vagas', element: <GerenciarVagas /> },
          { path: 'admin/vagas/:vagaId/editar', element: <EditarVagaAdmin /> }, // Adicionar a nova rota de edição
          { path: 'admin/candidaturas', element: <GerenciarCandidaturas /> },
          { path: 'admin/empresas/criar', element: <CriarEmpresaAdmin /> }, // Adicionar a nova rota de criação
          { path: 'admin/empresas', element: <GerenciarEmpresas /> }, // Adicionar a nova rota
          { path: 'admin/empresas/:id/editar', element: <EditarEmpresaAdmin /> }, // Adicionar a nova rota
          { path: 'admin/usuarios', element: <GerenciarUsuarios /> },
      ]}
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)