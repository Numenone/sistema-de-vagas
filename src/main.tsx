import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'

import App from './App.js'
import Login from './Login.js'
import Detalhes from './Detalhes.js'
import MinhasCandidaturas from './MinhasCandidaturas.js'
import CandidaturasEmpresa from './CandidaturasEmpresa.js' // Importar a nova página
import PerfilCandidato from './PerfilCandidato.js'; // Importar a nova página de perfil
import PerfilLider from './PerfilLider.js'; // Importa a nova página
import Cadastro from './Cadastro.js'
import EditarPerfil from './EditarPerfil.js' // This line already exists and is correct.
import MinhasVagas from './MinhasVagas.js'
import EsqueciSenha from './EsqueciSenha.js'
import EditarEmpresa from './EditarEmpresa.js'; // Importa a nova página
import EmpresaPerfil from './EmpresaPerfil.js'
import EditarVagaAdmin from './EditarVagaAdmin.js'; // Importar a nova página
import EditarEmpresaAdmin from './EditarEmpresaAdmin.js' // Importar a nova página
import MinhasVagasFavoritas from './MinhasVagasFavoritas.js'
import CriarEmpresaAdmin from './CriarEmpresaAdmin.js'; // Adicionar a nova rota de criação
import RedefinirSenha from './RedefinirSenha.js'

import Layout from './Layout.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './component/Dashboard.js';
import GerenciarVagas from './component/GerenciarVagas.js';
import GerenciarCandidaturas from './component/GerenciarCandidaturas.js';
import GerenciarEmpresas from './component/GerenciarEmpresas.js'; // Importar a nova página
import GerenciarUsuarios from './component/GerenciarUsuarios.js';
import AuthInitializer from './component/AuthInitializer.js';
import AdminProtectedRoute from './component/AdminProtectedRoute.js';

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