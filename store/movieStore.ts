'use client';

import { create } from 'zustand';
import { Movie, FilterOptions, Genre, Country, MovieType } from '@/types';
import { mockMovies, searchMovies as searchMock } from '@/data/mockMovies';

interface MovieState {
  movies: Movie[];
  searchResults: Movie[];
  searchQuery: string;
  filters: FilterOptions;
  isSearching: boolean;

  setSearchQuery: (q: string) => void;
  setFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void;
  resetFilters: () => void;
  runSearch: () => void;
}

const defaultFilters: FilterOptions = {
  genres: [],
  countries: [],
  years: [],
  type: 'all',
  sortBy: 'newest',
  minRating: 0,
};

export const useMovieStore = create<MovieState>((set, get) => ({
  movies: mockMovies,
  searchResults: [],
  searchQuery: '',
  filters: defaultFilters,
  isSearching: false,

  setSearchQuery: (q) => {
    set({ searchQuery: q });
    get().runSearch();
  },

  setFilter: (key, value) => {
    set(s => ({ filters: { ...s.filters, [key]: value } }));
    get().runSearch();
  },

  resetFilters: () => {
    set({ filters: defaultFilters, searchQuery: '', searchResults: [] });
  },

  runSearch: () => {
    const { searchQuery, filters, movies } = get();
    set({ isSearching: true });

    let results = searchQuery.trim()
      ? searchMock(searchQuery)
      : [...movies];

    if (filters.genres.length > 0)
      results = results.filter(m => filters.genres.some(g => m.genres.includes(g)));
    if (filters.countries.length > 0)
      results = results.filter(m => filters.countries.includes(m.country));
    if (filters.years.length > 0)
      results = results.filter(m => filters.years.includes(m.year));
    if (filters.type !== 'all')
      results = results.filter(m => m.type === filters.type);
    if (filters.minRating > 0)
      results = results.filter(m => m.cvRating >= filters.minRating);

    // sort
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'popular': return b.totalViews - a.totalViews;
        case 'rating':  return b.cvRating - a.cvRating;
        case 'year':    return b.year - a.year;
        default:        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    set({ searchResults: results, isSearching: false });
  },
}));
