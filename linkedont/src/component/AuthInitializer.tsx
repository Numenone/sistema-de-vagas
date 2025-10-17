// AuthInitializer.tsx
import { useEffect } from 'react'
import { useUsuarioStore } from '../context/UsuarioContext'
import React from 'react'

export default function AuthInitializer() {
  const { carregarUsuarioSalvo } = useUsuarioStore()

  useEffect(() => {
    carregarUsuarioSalvo()
  }, [carregarUsuarioSalvo])

  return null
}