import { create } from 'zustand';

export interface PokemonSprite {
  id: number;
  url: string;
  name: string;
}

interface User {
  id: number;
  username: string;
}

interface AppState {
  user: User | null;
  token: string | null;
  sprites: PokemonSprite[];
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  setSprites: (sprites: PokemonSprite[]) => void;
  addSprite: (sprite: PokemonSprite) => void;
  removeSprite: (id: number) => void;
  clearSprites: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  sprites: [],

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
    set({ user, token });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    set({ user: null, token: null, sprites: [] });
  },

  setSprites: (sprites) => set({ sprites }),

  addSprite: (sprite) =>
    set((state) => {
      if (state.sprites.some((s) => s.id === sprite.id || s.url === sprite.url)) {
        return state;
      }
      return { sprites: [sprite, ...state.sprites] };
    }),

  removeSprite: (id) =>
    set((state) => ({
      sprites: state.sprites.filter((s) => s.id !== id),
    })),

  clearSprites: () => set({ sprites: [] }),
}));
