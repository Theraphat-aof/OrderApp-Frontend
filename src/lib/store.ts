import { create } from 'zustand';
import { User } from './types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setAuthenticated: (authenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface FilterStore {
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: string;
  page: number;
  search: string;
  setCategory: (category: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSortBy: (sort: string) => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  category: null,
  minPrice: null,
  maxPrice: null,
  sortBy: 'newest',
  page: 1,
  search: '',
  setCategory: (category) => set({ category, page: 1 }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max, page: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, page: 1 }),
  setPage: (page) => set({ page }),
  setSearch: (search) => set({ search, page: 1 }),
  reset: () =>
    set({
      category: null,
      minPrice: null,
      maxPrice: null,
      sortBy: 'newest',
      page: 1,
      search: '',
    }),
}));
