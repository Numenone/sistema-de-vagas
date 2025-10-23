import Titulo from './component/Titulo'
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