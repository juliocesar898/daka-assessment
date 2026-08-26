interface AuthAlertProps {
  type: 'error' | 'success';
  message: string;
}

export function AuthAlert({ type, message }: AuthAlertProps) {
  const isError = type === 'error';
  return (
    <div
      className={`p-3 border-2 rounded-xl text-xs font-semibold ${
        isError
          ? 'bg-red-50 border-red-500 text-red-700 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]'
          : 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-[2px_2px_0px_0px_rgba(16,185,129,1)]'
      }`}
    >
      {message}
    </div>
  );
}
