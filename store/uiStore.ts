'use client';

import { create } from 'zustand';
import { DeviceTier } from '@/types';

interface UIState {
  theme: 'dark' | 'light';
  isPlayerMode: boolean;
  isNavOpen: boolean;
  deviceTier: DeviceTier;
  searchOpen: boolean;
  authModalOpen: boolean;
  trailerUrl: string | null;

  setTheme: (t: UIState['theme']) => void;
  toggleTheme: () => void;
  setPlayerMode: (v: boolean) => void;
  setNavOpen: (v: boolean) => void;
  setDeviceTier: (t: DeviceTier) => void;
  setSearchOpen: (v: boolean) => void;
  openTrailer: (url: string) => void;
  closeTrailer: () => void;
  setAuthModalOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'dark',
  isPlayerMode: false,
  isNavOpen: false,
  deviceTier: 'high',
  searchOpen: false,
  authModalOpen: false,
  trailerUrl: null,

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },
  setPlayerMode: (isPlayerMode) => set({ isPlayerMode }),
  setNavOpen: (isNavOpen) => set({ isNavOpen }),
  setDeviceTier: (deviceTier) => set({ deviceTier }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  openTrailer: (trailerUrl) => set({ trailerUrl }),
  closeTrailer: () => set({ trailerUrl: null }),
  setAuthModalOpen: (authModalOpen) => set({ authModalOpen }),
}));
