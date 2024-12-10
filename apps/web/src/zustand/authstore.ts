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
    totalWorker: null,
    productLaundry: null,

    setAuth: ({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, productLaundry,
    }: IAuthStore) => set({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, productLaundry
    }),

    setKeepAuth: ({
      firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, productLaundry
    }: IAuthStore) => set({
      firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, productLaundry
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
      totalWorker: null,
      productLaundry: null
    }),
  }),

    {
      name: 'authToken',
      partialize: (state: any) => ({ token: state.token }),
    }),
);

export default authStore;
