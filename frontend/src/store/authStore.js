import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      })),

      // Refresh user data from server
      refreshUser: async () => {
        try {
          const { token, user } = get();
          if (!token || !user) return;

          const response = await api.get('/users/profile');
          if (response.data?.user) {
            set({ user: response.data.user });
          }
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      },
    }),
    {
      name: 'oneminutelab-auth',
    }
  )
);





