import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IAuthStore } from './types';

const authStore = create(
  persist((set) => ({ token: '', firstName: '', 
    setAuth: ({ token, firstName }: IAuthStore) => set({ token, firstName }),
      setKeepAuth: ({ token, firstName }: IAuthStore) => set({ token, firstName }),
      resetAuth: () => set({  token: '', firstName: '' })}),

    { name: 'authToken', partialize: (state: any) => ({ token: state.token })},
  ),
);

export default authStore;
