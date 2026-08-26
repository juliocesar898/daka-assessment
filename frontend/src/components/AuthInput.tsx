'use client';

import React, { useState } from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === 'password';

    const currentType = isPasswordField
      ? showPassword
        ? 'text'
        : 'password'
      : type;

    return (
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={currentType}
            {...props}
            className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border-2 rounded-xl focus:outline-none transition-all placeholder:text-slate-400 font-medium ${
              isPasswordField ? 'pr-10' : ''
            } ${
              error
                ? 'border-red-500 bg-red-50/30 focus:shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
                : 'border-slate-900 focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
            }`}
          />

          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 focus:outline-none p-1 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                /* Contraseña visible -> Ícono Ojo Abierto (Acción: Ocultar) */
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                /* Contraseña oculta -> Ícono Ojo Tachado (Acción: Mostrar) */
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-red-600 font-medium text-[11px] mt-1">{error}</p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';
