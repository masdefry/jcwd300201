'use client'

import { ReactNode, useEffect, useState } from "react";
import { locationStore } from '@/zustand/locationStore'
import { useGeolocated } from "react-geolocated";
import axios from 'axios'

export default function AuthProviders({ children }: { children: ReactNode }) {
    const setLocationUser = locationStore((state) => state?.setLocationUser)
    const latitude = locationStore((state) => state?.latitude)
    const longitude = locationStore((state) => state?.longitude)
    const [dataUser, setDataUser] = useState<string>('')

    console.log(latitude)
    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 10000,
    });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationUser({
                        latitude: position?.coords?.latitude,
                        longitude: position?.coords?.longitude
                    })

                    console.log("location>>", position);
                },
                (error) => {
                    console.log("??", error);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, [coords, setLocationUser])

    useEffect(() => {
        const getLocation = async (): Promise<void> => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude?.toString()}&lon=${longitude?.toString()}&format=json`)
                setDataUser(response?.data?.display_name)
            } catch (error) {
                console.log(error)
            }
        }
        if (latitude && longitude) {
            getLocation()
        }

    }, [latitude, longitude])

    return (
        <>
            {children}
        </>
    );
}