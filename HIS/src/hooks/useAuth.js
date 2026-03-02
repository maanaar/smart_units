import useAuthStore from '../features/auth/store';

export function useAuth() {
  const { user, token, setUser, setToken, logout } = useAuthStore();
  return { user, token, setUser, setToken, logout, isAuthenticated: !!token };
}
