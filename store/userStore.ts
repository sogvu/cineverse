'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchEntry {
  movieId: string;
  episodeId?: string;
  progress: number;
  duration: number;
  watchedAt: string;
}

interface UserState {
  isLoggedIn: boolean;
  user: { id: string; name: string; email: string; avatar?: string; provider: 'email' | 'google' | 'facebook' } | null;
  watchlist: string[];
  watchHistory: WatchEntry[];

  login: (user: UserState['user']) => void;
  logout: () => void;
  toggleWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
  updateProgress: (movieId: string, progress: number, duration: number, episodeId?: string) => void;
  getProgress: (movieId: string, episodeId?: string) => number;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      watchlist: [],
      watchHistory: [],

      login: (user) => set({ isLoggedIn: true, user }),
      logout: () => set({ isLoggedIn: false, user: null }),

      toggleWatchlist: (movieId) => {
        const { watchlist } = get();
        const exists = watchlist.includes(movieId);
        set({ watchlist: exists ? watchlist.filter(id => id !== movieId) : [...watchlist, movieId] });
      },

      isInWatchlist: (movieId) => get().watchlist.includes(movieId),

      updateProgress: (movieId, progress, duration, episodeId) => {
        const { watchHistory } = get();
        const existing = watchHistory.findIndex(
          e => e.movieId === movieId && e.episodeId === episodeId
        );
        const entry: WatchEntry = { movieId, episodeId, progress, duration, watchedAt: new Date().toISOString() };
        if (existing >= 0) {
          const updated = [...watchHistory];
          updated[existing] = entry;
          set({ watchHistory: updated });
        } else {
          set({ watchHistory: [entry, ...watchHistory].slice(0, 100) });
        }
      },

      getProgress: (movieId, episodeId) => {
        const entry = get().watchHistory.find(
          e => e.movieId === movieId && e.episodeId === episodeId
        );
        return entry?.progress ?? 0;
      },
    }),
    { name: 'cineverse-user' }
  )
);
