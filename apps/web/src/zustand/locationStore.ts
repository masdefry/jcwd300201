import { create } from 'zustand'

interface ILocationUser {
  latitude: number | null,
  longitude: number | null,
}

interface LocationState extends ILocationUser {
  checkAddressOutlet: boolean;
  setLocationUser: (location: ILocationUser) => void;
  setIsPositionCheck: (check: boolean) => void;
}

const locationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  checkAddressOutlet: false,

  setLocationUser: ({ latitude, longitude }: ILocationUser) => set({ latitude, longitude }),
  setIsPositionCheck: (check: boolean) => set({ checkAddressOutlet: check }),
}));

export { locationStore }