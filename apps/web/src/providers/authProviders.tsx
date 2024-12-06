'use client'

import { ReactNode, useEffect, useState } from "react";
import { locationStore } from '@/zustand/locationStore'
import { useGeolocated } from "react-geolocated";
import axios from 'axios'
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";

export default function AuthProviders({ children }: { children: ReactNode }) {
    const setLocationUser = locationStore((state) => state?.setLocationUser)
    const latitude = locationStore((state) => state?.latitude)
    const longitude = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const setKeepAuth = authStore((state) => state?.setKeepAuth)
    const [dataUser, setDataUser] = useState<string>('')

    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
        },
        userDecisionTimeout: 10000,
    });

    const handleKeepAuth = async () => {
        try {
            const response = await instance.get('/auth/keep-auth-user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if(response?.data?.data?.role == 'CUSTOMER') {
                setKeepAuth({
                    email: response?.data?.data?.email,
                    firstName: response?.data?.data?.firstName,
                    isDiscountUsed: response?.data?.data?.isDiscountUsed,
                    isVerify: response?.data?.data?.isVerify,
                    lastName: response?.data?.data?.lastName,
                    profilePicture: response?.data?.data?.profilePicture,
                    role: response?.data?.data?.role
                })
            }


            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocationUser({
                        latitude: position?.coords?.latitude,
                        longitude: position?.coords?.longitude
                    })
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
        if (token) {
            handleKeepAuth()
        }
    }, [token])

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