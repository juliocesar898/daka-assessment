import { motion } from 'framer-motion';
import { PokemonSprite } from '@/store/useAppStore';

interface PokemonCardProps {
  sprite: PokemonSprite;
  onDelete: (id: number) => void;
}

export function PokemonCard({ sprite, onDelete }: PokemonCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, filter: 'blur(4px)', y: -10 }}
      transition={{
        type: 'spring',
        stiffness: 350,
        damping: 25,
        opacity: { duration: 0.2 },
      }}
      className="bg-white p-3.5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:translate-y-[-2px] transition-all relative group flex flex-col items-center"
    >
      <button
        onClick={() => onDelete(sprite.id)}
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
  );
}
