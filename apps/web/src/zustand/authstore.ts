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
    orders: null,
    store: '',

    setAuth: ({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, orders, store,
    }: IAuthStore) => set({
      token, firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, orders, store,
    }),

    setKeepAuth: ({
      firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, orders, store,
    }: IAuthStore) => set({
      firstName, lastName, email, role,
      isVerified, profilePicture, isDiscountUsed, totalWorker, orders, store,
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
      orders: null,
      store: ''
    }),
  }),

    {
      name: 'authToken',
      partialize: (state: any) => ({ token: state?.token }),
    }),
);

export default authStore;
