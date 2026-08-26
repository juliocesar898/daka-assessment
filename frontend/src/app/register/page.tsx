'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import BrandLogo from '@/components/BrandLogo';
import { AuthInput } from '@/components/AuthInput';
import { AuthAlert } from '@/components/AuthAlert';

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, 'El usuario debe tener al menos 3 caracteres')
      .max(20, 'El usuario no puede exceder 20 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'Solo se permiten letras, números y guiones bajos'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
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
      router.push('/login?registered=true');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('No se pudo completar el registro.');
      } else {
        setError(err.response?.data?.message || 'Error al procesar el registro');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 bg-tech-pattern p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-amber-400 to-blue-600" />
        <BrandLogo />

        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Crear cuenta</h2>
          <p className="text-xs font-medium text-slate-500">Ingresa tus datos para registrarte</p>
        </div>

        {error && <AuthAlert type="error" message={error} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <AuthInput
            label="Usuario"
            placeholder="username"
            {...register('username')}
            error={errors.username?.message}
          />
          <AuthInput
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <AuthInput
            label="Confirmar Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(37,99,235,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-600 font-medium">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
