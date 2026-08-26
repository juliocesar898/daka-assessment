import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: number;
  username: string;
}

export interface PokemonSprite {
  id: number;
  url: string;
  name: string;
}

interface AppState {
  token: string | null;
  user: User | null;
  sprites: PokemonSprite[];
  setAuth: (user: User, token: string) => void;
  setSprites: (sprites: PokemonSprite[]) => void;
  addSprite: (sprite: PokemonSprite) => void;
  removeSprite: (id: number) => void;
  clearSprites: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      sprites: [],
      setAuth: (user, token) => set({ user, token }),
      setSprites: (sprites) => set({ sprites }),
      addSprite: (sprite) =>
        set((state) => ({
          sprites: state.sprites.some((s) => s.id === sprite.id)
            ? state.sprites
            : [sprite, ...state.sprites],
        })),
      removeSprite: (id) =>
        set((state) => ({
          sprites: state.sprites.filter((s) => s.id !== id),
        })),
      clearSprites: () => set({ sprites: [] }),
      logout: () => {
        set({ token: null, user: null, sprites: [] });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('app-storage');
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
