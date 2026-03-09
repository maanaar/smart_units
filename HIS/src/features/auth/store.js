import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  unit: null,          // 'agial' | 'nicu' | 'opd' | …  — set on login
  isLoggedIn: false,

  login: (user, token, unit) => set({ user, token, unit, isLoggedIn: true }),
  logout: () => set({ user: null, token: null, unit: null, isLoggedIn: false }),
}));

export default useAuthStore;
