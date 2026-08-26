'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore, PokemonSprite } from '@/store/useAppStore';
import api from '@/lib/axios';

type WsStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export default function DashboardPage() {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>('CONNECTING');

  const { token, user, sprites, setSprites, addSprite, removeSprite, clearSprites, logout } = useAppStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!user) {
      api.get('/auth/me')
        .then((res) => {
          useAppStore.getState().setAuth(res.data, token);
        })
        .catch(() => {
          logout();
          router.push('/login');
        });
    }

    api.get('/pokemon')
      .then((res) => setSprites(res.data))
      .catch(() => { });

    // 🔌 Conexión con Socket.io
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      auth: { token: `Bearer ${token}` },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setWsStatus('CONNECTED');
      setErrorMsg(null);
    });

    socket.on('disconnect', () => {
      setWsStatus('DISCONNECTED');
    });

    socket.on('connect_error', () => {
      setWsStatus('DISCONNECTED');
      setErrorMsg('Error de conexión en tiempo real con el servidor');
    });

    socket.on('sprite-served', (sprite: PokemonSprite) => {
      addSprite(sprite);
      setErrorMsg(null);
    });

    socket.on('pokemon-error', (data: { message: string }) => {
      setErrorMsg(data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, router, setSprites, addSprite, user, logout]);

  const handleRequestSprite = () => {
    setErrorMsg(null);
    if (socketRef.current && wsStatus === 'CONNECTED') {
      socketRef.current.emit('request-sprite');
    }
  };

  const handleDeleteOne = async (id: number) => {
    try {
      await api.delete(`/pokemon/${id}`);
      removeSprite(id);
      if (socketRef.current && wsStatus === 'CONNECTED') {
        socketRef.current.emit('delete-sprite', { id });
      }
    } catch (err) {
      setErrorMsg('Error al eliminar el sprite');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await api.delete('/pokemon/all');
      clearSprites();
    } catch (err) {
      setErrorMsg('Error al eliminar todos los sprites');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-tech-pattern text-slate-900">
      {/* Header Estilo Consola */}
      <header className="border-b-2 border-slate-900 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">

          {/* Badge de Estado del WebSocket */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${wsStatus === 'CONNECTED'
              ? 'bg-emerald-50 border-emerald-300'
              : wsStatus === 'CONNECTING'
                ? 'bg-amber-50 border-amber-300'
                : 'bg-red-50 border-red-300'
            }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${wsStatus === 'CONNECTED' ? 'bg-emerald-400' : wsStatus === 'CONNECTING' ? 'bg-amber-400' : 'bg-red-400'
                }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${wsStatus === 'CONNECTED' ? 'bg-emerald-500' : wsStatus === 'CONNECTING' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
            </span>
            <h1 className={`text-[11px] font-mono font-bold tracking-wider uppercase ${wsStatus === 'CONNECTED' ? 'text-emerald-800' : wsStatus === 'CONNECTING' ? 'text-amber-800' : 'text-red-800'
              }`}>
              {wsStatus === 'CONNECTED' ? 'WS ONLINE' : wsStatus === 'CONNECTING' ? 'WS CONECTANDO...' : 'WS OFFLINE'}
            </h1>
          </div>

          {/* Datos del usuario */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 pr-3 border-r border-slate-300">
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_rgba(37,99,235,1)]">
                  {user.username.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Hola, <span className="font-bold text-slate-900">{user.username}</span>
                </span>
              </div>
            )}

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl text-xs font-semibold shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]">
            {errorMsg}
          </div>
        )}

        {/* Panel de Controles */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Mis Pokémones</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Fichas en memoria tiempo real</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRequestSprite}
              disabled={wsStatus !== 'CONNECTED'}
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Request Sprite
            </button>
            {sprites.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="bg-white border-2 border-slate-900 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                Limpiar Todo ({sprites.length})
              </button>
            )}
          </div>
        </div>

        {/* Transición entre Empty State y Grid */}
        <AnimatePresence mode="wait">
          {sprites.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-400 rounded-2xl bg-white/80 shadow-[3px_3px_0px_0px_rgba(15,23,42,0.1)] text-slate-500"
            >
              <svg
                className="w-10 h-10 mb-3 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Sin ítems en pantalla</p>
              <p className="text-xs text-slate-500 mt-1">
                Haz clic en <span className="font-bold text-blue-600">"Request Sprite"</span> para solicitar uno vía WebSocket.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5"
            >
              <AnimatePresence mode="popLayout">
                {sprites.map((sprite) => (
                  <motion.div
                    key={sprite.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, filter: 'blur(4px)', y: -10 }}
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 25,
                      opacity: { duration: 0.2 }
                    }}
                    className="bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-all relative group flex flex-col items-center"
                  >
                    <button
                      onClick={() => handleDeleteOne(sprite.id)}
                      className="absolute top-2 right-2 w-5 h-5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-mono text-[10px] font-bold flex items-center justify-center border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all z-10"
                      title="Eliminar"
                    >
                      ✕
                    </button>

                    <img
                      src={sprite.url}
                      alt={sprite.name}
                      className="w-20 h-20 object-contain drop-shadow-md select-none"
                    />

                    <span className="mt-2 text-[11px] font-mono font-bold capitalize text-slate-800 truncate w-full text-center tracking-wide bg-slate-100 px-2 py-0.5 rounded-md border border-slate-300">
                      {sprite.name}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
