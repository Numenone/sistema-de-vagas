import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Pusher from 'pusher-js';
import type { Members, PresenceChannel } from 'pusher-js';
import { useUsuarioStore } from '../context/UsuarioContext.js';
import type { CandidaturaType } from '../utils/CandidaturaType.js';
import { Send } from 'lucide-react';

const pusherKey = import.meta.env.VITE_PUSHER_KEY;
const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;
const apiUrl = import.meta.env.VITE_API_URL;

type Mensagem = {
  id: number;
  conteudo: string;
  remetenteId: number;
  createdAt: string;
  lida: boolean;
  remetente: {
    nome: string;
    fotoPerfil: string;
  };
};
type OnlineUser = { id: number; nome: string };

type ChatModalProps = {
  candidatura: CandidaturaType;
  onClose: () => void;
};

export default function ChatModal({ candidatura, onClose }: ChatModalProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState<boolean>(false);
  const { usuario, fetchAutenticado, token } = useUsuarioStore();
  const { register, handleSubmit, reset } = useForm<{ conteudo: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to fetch initial messages
  useEffect(() => {
    async function fetchMensagens() {
      try {
        const response = await fetchAutenticado(`${apiUrl}/api/mensagens/candidatura/${candidatura.id}`);
        if (!response.ok) throw new Error('Falha ao buscar mensagens.');
        const data = await response.json();
        setMensagens(data);
      } catch (error) {
        toast.error('Erro ao carregar mensagens.');
      }
    }
    fetchMensagens();
  }, [candidatura.id, fetchAutenticado]);

  // Effect to handle WebSocket connection
  useEffect(() => {
    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
      authEndpoint: `${apiUrl}/api/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const channelName = `presence-candidatura-${candidatura.id}`;
    const channel = pusher.subscribe(channelName) as PresenceChannel;

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const users = Object.keys(members.members).map(id => ({ id: Number(id), nome: members.members[id].nome }));
      setOnlineUsers(users);
    });

    channel.bind('pusher:member_added', (member: { id: string; info: { nome: string } }) => {
      setOnlineUsers(prev => [...prev, { id: Number(member.id), nome: member.info.nome }]);
    });

    channel.bind('pusher:member_removed', (member: { id: string }) => {
      setOnlineUsers(prev => prev.filter(u => u.id !== Number(member.id)));
    });

    channel.bind('new_message', (novaMensagem: Mensagem) => {
      if (novaMensagem.remetenteId !== usuario.id) {
        setIsOtherUserTyping(false);
        setMensagens(prev => [...prev, novaMensagem]);
      }
    });

    channel.bind('client-typing', (data: { isTyping: boolean }) => {
      setIsOtherUserTyping(data.isTyping);
    });

    channel.bind('messages_read', (data: { readerId: number }) => {
      if (data.readerId !== usuario.id) {
        setMensagens(prev =>
          prev.map(msg => msg.remetenteId === usuario.id ? { ...msg, lida: true } : msg)
        );
      }
    });

    // Cleanup on component unmount
    return () => {
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [candidatura.id, usuario.id, usuario.nome, fetchAutenticado, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  async function onSubmit(data: { conteudo: string }) {
    const destinatarioId = usuario.id === candidatura.usuarioId
        ? candidatura.vaga.empresa.lideres?.[0]?.id
        : candidatura.usuarioId;

    if (!destinatarioId) {
        toast.error("Não foi possível identificar o destinatário da mensagem.");
        return;
    }

    // Optimistic UI update
    const tempId = Date.now();
    const optimisticMessage: Mensagem = {
      id: tempId,
      conteudo: data.conteudo,
      remetenteId: usuario.id,
      createdAt: new Date().toISOString(),
      lida: false,
      remetente: {
        nome: usuario.nome,
        fotoPerfil: usuario.fotoPerfil || ''
      }
    };
    setMensagens(prev => [...prev, optimisticMessage]);
    reset();

    try {
      const response = await fetchAutenticado(`${apiUrl}/api/mensagens`, {
        method: 'POST',
        body: JSON.stringify({
          conteudo: data.conteudo,
          destinatarioId: usuario.id === candidatura.usuarioId
            ? candidatura.vaga.empresa.lideres?.[0]?.id
            : candidatura.usuarioId,
          candidaturaId: candidatura.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar mensagem.');
      }

      const sentMessage = await response.json();

      // Replace optimistic message with the real one from the server
      setMensagens(prev => prev.map(msg => msg.id === tempId ? sentMessage : msg));

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      triggerTypingEvent(false);
    } catch (error) {
      toast.error('Erro ao enviar mensagem.');
      // Revert optimistic update on error
      setMensagens(prev => prev.filter(msg => msg.id !== tempId));
    }
  }

  const triggerTypingEvent = (isTyping: boolean) => {
    const channel = (Pusher.instances[0] as any)?.channel(`presence-candidatura-${candidatura.id}`);
    channel?.trigger('client-typing', { isTyping });
  };

  const handleTyping = () => {
    triggerTypingEvent(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      triggerTypingEvent(false);
    }, 2000); // 2 seconds of inactivity
  };

  const otherPerson = usuario.id === candidatura.usuarioId
    ? candidatura.vaga.empresa.lideres?.[0]
    : candidatura.usuario;

  const chatTitle = otherPerson ? `Conversa com ${otherPerson.nome}` : "Chat";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">{chatTitle}</h2>
            <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
              {onlineUsers.some(u => u.id !== usuario.id) ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span>Online</span>
                </>
              ) : (
                <span>Offline</span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">Vaga: {candidatura.vaga.titulo}</p>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {mensagens.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.remetenteId === usuario.id ? 'justify-end' : 'justify-start'}`}>
              {msg.remetenteId !== usuario.id && (
                <img src={msg.remetente.fotoPerfil} alt={msg.remetente.nome} className="w-8 h-8 rounded-full" />
              )}
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.remetenteId === usuario.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p>{msg.conteudo}</p>
                <div className={`text-xs mt-1 ${msg.remetenteId === usuario.id ? 'text-blue-200' : 'text-gray-500'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                {msg.remetenteId === usuario.id && (
                  <div className={`text-xs mt-1 ${msg.lida ? 'text-blue-200' : 'text-blue-300'}`}>
                    {msg.lida ? 'Lida' : 'Enviada'}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isOtherUserTyping && (
            <div className="flex items-end gap-2 justify-start">
              <div className="px-4 py-2 rounded-lg bg-gray-200 text-gray-500 italic">
                digitando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
            <input
              {...register('conteudo', { required: true })}
              onChange={handleTyping}
              type="text"
              placeholder="Digite sua mensagem..."
              className="form-input flex-1"
              autoComplete="off"
            />
            <button type="submit" className="btn-primary p-2">
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}