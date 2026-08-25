'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import BrandLogo from '@/components/BrandLogo';

const registerSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      await api.post('/auth/register', {
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el usuario');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm p-8 space-y-6">

        <BrandLogo />

        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Crear cuenta</h2>
          <p className="text-xs text-slate-500">Ingresa tus datos para registrarte</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50/80 border border-red-200/60 text-red-600 rounded-lg text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Usuario</label>
            <input
              {...register('username')}
              placeholder="julioflores"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-900 transition-all placeholder:text-slate-400"
            />
            {errors.username && <p className="text-red-500 text-[11px] mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Contraseña</label>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-900 transition-all placeholder:text-slate-400"
            />
            {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Confirmar Contraseña</label>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-900 transition-all placeholder:text-slate-400"
            />
            {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-slate-900 font-medium hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
