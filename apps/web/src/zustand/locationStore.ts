import {create} from 'zustand'

interface ILocationUser {
    latitude: number | null,
    longitude: number | null
}

interface LocationState extends ILocationUser {
  setLocationUser: (location: ILocationUser) => void;
}

const locationStore = create<LocationState>((set)=> ({
    latitude: null,
    longitude: null,

    setLocationUser: ({latitude, longitude}: ILocationUser) => set({latitude, longitude})
}))

export { locationStore }