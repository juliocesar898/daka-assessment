'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore, PokemonSprite } from '@/store/useAppStore';
import api from '@/lib/axios';

export default function DashboardPage() {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
      auth: { token: `Bearer ${token}` },
    });

    socketRef.current = socket;

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
    if (socketRef.current) {
      socketRef.current.emit('request-sprite');
    }
  };

  const handleDeleteOne = async (id: number) => {
    try {
      await api.delete(`/pokemon/${id}`);
      removeSprite(id);
      if (socketRef.current) {
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h1 className="text-xs font-semibold tracking-wide text-slate-800 uppercase">STATUS</h1>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2 pr-3 border-r border-slate-200/80">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold uppercase select-none">
                  {user.username.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Hola, <span className="font-semibold text-slate-900">{user.username}</span>
                </span>
              </div>
            )}

            <button
              onClick={() => {
                logout();
                router.push('/login');
              }}
              className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50/80 border border-red-200/60 text-red-600 rounded-lg text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Mis Pokémones</h2>
            <p className="text-xs text-slate-500 mt-0.5">Listado de items</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRequestSprite}
              className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              Request Sprite
            </button>
            {sprites.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="bg-white border border-slate-200 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                Limpiar Todo ({sprites.length})
              </button>
            )}
          </div>
        </div>

        {/* Transición entre Empty State y Grid de Pokémones */}
        <AnimatePresence mode="wait">
          {sprites.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 text-slate-400"
            >
              <svg
                className="w-10 h-10 mb-3 text-slate-300"
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
              <p className="text-xs font-medium text-slate-500">Sin ítems en pantalla.</p>
              <p className="text-xs text-slate-400 mt-1">
                Haz clic en <span className="font-semibold text-blue-600">"Request Sprite"</span> para solicitar uno vía WebSocket.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="grid-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
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
                    className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm hover:border-slate-300 transition-colors relative group flex flex-col items-center"
                  >
                    <button
                      onClick={() => handleDeleteOne(sprite.id)}
                      className="absolute top-2.5 right-2.5 w-4 h-4 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-mono text-[9px] font-bold flex items-center justify-center border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all z-10"
                      title="Eliminar"
                    >
                      ✕
                    </button>

                    <img
                      src={sprite.url}
                      alt={sprite.name}
                      className="w-20 h-20 object-contain drop-shadow-sm select-none"
                    />

                    <span className="mt-1 text-[11px] font-medium capitalize text-slate-600 truncate w-full text-center tracking-wide">
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
