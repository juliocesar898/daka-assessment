import { User } from '@/store/useAppStore';

type WsStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

interface DashboardHeaderProps {
  user: User | null;
  wsStatus: WsStatus;
  onLogout: () => void;
}

export function DashboardHeader({ user, wsStatus, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b-2 border-slate-900 bg-white/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Badge de Estado del WebSocket */}
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
            wsStatus === 'CONNECTED'
              ? 'bg-emerald-50 border-emerald-300'
              : wsStatus === 'CONNECTING'
              ? 'bg-amber-50 border-amber-300'
              : 'bg-red-50 border-red-300'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                wsStatus === 'CONNECTED'
                  ? 'bg-emerald-400'
                  : wsStatus === 'CONNECTING'
                  ? 'bg-amber-400'
                  : 'bg-red-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                wsStatus === 'CONNECTED'
                  ? 'bg-emerald-500'
                  : wsStatus === 'CONNECTING'
                  ? 'bg-amber-500'
                  : 'bg-red-500'
              }`}
            />
          </span>
          <h1
            className={`text-[11px] font-mono font-bold tracking-wider uppercase ${
              wsStatus === 'CONNECTED'
                ? 'text-emerald-800'
                : wsStatus === 'CONNECTING'
                ? 'text-amber-800'
                : 'text-red-800'
            }`}
          >
            {wsStatus === 'CONNECTED'
              ? 'WS ONLINE'
              : wsStatus === 'CONNECTING'
              ? 'WS CONECTANDO...'
              : 'WS OFFLINE'}
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
            onClick={onLogout}
            className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>
  );
}
