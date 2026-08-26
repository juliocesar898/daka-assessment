import { motion } from 'framer-motion';

export function PokemonEmptyState() {
  return (
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
      <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
        Sin ítems en pantalla
      </p>
      <p className="text-xs text-slate-500 mt-1">
        Haz clic en <span className="font-bold text-blue-600">"Request Sprite"</span> para solicitar uno vía WebSocket.
      </p>
    </motion.div>
  );
}
