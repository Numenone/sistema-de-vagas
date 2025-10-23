import Titulo from './component/Titulo.js'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import React from 'react'


export default function Layout() {
  return (
    <>
      <Titulo />
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  )
}