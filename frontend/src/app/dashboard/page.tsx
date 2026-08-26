'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore, PokemonSprite } from '@/store/useAppStore';
import api from '@/lib/axios';
import { DashboardHeader } from '@/components/DashboardHeader';
import { PokemonCard } from '@/components/PokemonCard';
import { PokemonEmptyState } from '@/components/PokemonEmptyState';
import { AuthAlert } from '@/components/AuthAlert';

type WsStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export default function DashboardPage() {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<WsStatus>('CONNECTING');

  const { token, user, sprites, setSprites, addSprite, removeSprite, clearSprites, logout } =
    useAppStore();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (!user) {
      api
        .get('/auth/me')
        .then((res) => {
          useAppStore.getState().setAuth(res.data, token);
        })
        .catch(() => {
          logout();
          router.push('/login');
        });
    }

    api
      .get('/pokemon')
      .then((res) => setSprites(res.data))
      .catch(() => { });

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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 bg-tech-pattern text-slate-900">
      <DashboardHeader user={user} wsStatus={wsStatus} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {errorMsg && (
          <div className="mb-6">
            <AuthAlert type="error" message={errorMsg} />
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Mis Pokémones</h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Fichas en memoria tiempo real
            </p>
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

        <AnimatePresence mode="wait">
          {sprites.length === 0 ? (
            <PokemonEmptyState />
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
                  <PokemonCard key={sprite.id} sprite={sprite} onDelete={handleDeleteOne} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
