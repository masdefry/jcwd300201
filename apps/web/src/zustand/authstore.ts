import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IAuthStore } from './types';

const authStore = create(
  persist((set) => ({
    token: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '', 
    isVerified: false, 
    profilePicture: '', 
    isDiscountUsed: false, 

    setAuth: ({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed,
    }: IAuthStore) => set({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed
    }),

    setKeepAuth: ({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed
    }: IAuthStore) => set({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed
    }),

    resetAuth: () => set({
      token: '',
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      isVerified: false,
      profilePicture: '',
      isDiscountUsed: false,
    }),
  }),

  {
    name: 'authToken', 
    partialize: (state: any) => ({ token: state.token }),
  }),
);

export default authStore;
