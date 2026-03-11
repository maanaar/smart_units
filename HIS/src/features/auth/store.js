import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      unit: null,
      isLoggedIn: false,

      login: (user, token, unit) => set({ user, token, unit, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, unit: null, isLoggedIn: false }),
    }),
    { name: 'auth' }   // key in localStorage
  )
);

export default useAuthStore;
