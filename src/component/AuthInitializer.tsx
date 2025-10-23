// AuthInitializer.tsx
import { useEffect } from 'react'
import { useUsuarioStore } from '../context/UsuarioContext'
import { subscribeToPush } from '../utils/push'; // This path is now correct
import { useRegisterSW } from 'virtual:pwa-register/react'

export default function AuthInitializer() {
  const { carregarUsuarioSalvo, usuario, fetchAutenticado } = useUsuarioStore();

  // This hook from vite-plugin-pwa handles the service worker registration and updates.
  useRegisterSW({
    onRegistered(_r) {
      console.log('Service Worker registered.');
    },
    onNeedRefresh() {
      console.log('New content available, refreshing...');
    }
  });

  useEffect(() => {
    carregarUsuarioSalvo()
  }, [carregarUsuarioSalvo])

  useEffect(() => {
    if (usuario.id && 'Notification' in window && Notification.permission === 'granted') {
      subscribeToPush(fetchAutenticado); // This path is now correct
    }
  }, [usuario.id, fetchAutenticado]);

  return null
}