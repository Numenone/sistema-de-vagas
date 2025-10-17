import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'

import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MinhasCandidaturas from './MinhasCandidaturas.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './component/Dashboard.tsx';
import GerenciarVagas from './component/GerenciarVagas.tsx';
import GerenciarCandidaturas from './component/GerenciarCandidaturas.tsx';
import AuthInitializer from './component/AuthInitializer.tsx';

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
      { path: 'detalhes/:vagaId', element: <Detalhes /> },
      { path: 'minhasCandidaturas', element: <MinhasCandidaturas /> },
      { path: 'admin/dashboard', element: <Dashboard /> },
      { path: 'admin/vagas', element: <GerenciarVagas /> },
      { path: 'admin/candidaturas', element: <GerenciarCandidaturas /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)