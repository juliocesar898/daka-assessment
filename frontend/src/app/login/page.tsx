'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAppStore } from '@/store/useAppStore';
import BrandLogo from '@/components/BrandLogo';

// 🛡️ Esquema Zod de Login con validación fina
const loginSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAppStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('Tu sesión ha expirado. Por favor, ingresa nuevamente.');
    } else if (searchParams.get('registered') === 'true') {
      setInfoMsg('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
    }
  }, [searchParams]);

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setInfoMsg(null);
    try {
      const response = await api.post('/auth/login', data);
      const { access_token } = response.data;

      const userRes = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      setAuth(userRes.data, access_token);
      router.push('/dashboard');
    } catch (err: any) {
      // 🛡️ OWASP: Mensaje genérico para no revelar si falló el usuario o la contraseña
      setError(err.response?.data?.message || 'Credenciales inválidas');
    }
  };

  return (
    <div className="max-w-sm w-full bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-8 space-y-6 relative overflow-hidden">

      {/* Accent Bar Superior */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />

      <BrandLogo />

      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Iniciar sesión</h2>
        <p className="text-xs font-medium text-slate-500">Ingresa tus credenciales para continuar</p>
      </div>

      {/* Alerta de Éxito / Registro */}
      {infoMsg && (
        <div className="p-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-800 rounded-xl text-xs font-semibold shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]">
          {infoMsg}
        </div>
      )}

      {/* Alerta de Error / Expiración */}
      {error && (
        <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl text-xs font-semibold shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Usuario
          </label>
          <input
            {...register('username')}
            placeholder="julioflores"
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border-2 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 font-medium ${errors.username
                ? 'border-red-500 bg-red-50/30 focus:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                : 'border-slate-900 focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              }`}
          />
          {errors.username && (
            <p className="text-red-600 font-medium text-[11px] mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border-2 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 font-medium ${errors.password
                ? 'border-red-500 bg-red-50/30 focus:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                : 'border-slate-900 focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
              }`}
          />
          {errors.password && (
            <p className="text-red-600 font-medium text-[11px] mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>

      <p className="text-xs text-center text-slate-600 font-medium">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-blue-600 font-bold hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-tech-pattern p-4">
      <Suspense fallback={<div className="text-xs font-mono font-bold text-slate-500">Cargando...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
