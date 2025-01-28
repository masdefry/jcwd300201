'use client'

import { ReactNode, useEffect, useState } from "react";
import { locationStore } from '@/zustand/locationStore'
import { useGeolocated } from "react-geolocated";
import axios from 'axios'
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";

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
        const handleKeepAuth = async () => {
            try {
                const response = await instance.get('/auth/keep-auth', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response?.data?.data?.role == 'CUSTOMER') {
                    setKeepAuth({
                        email: response?.data?.data?.email,
                        firstName: response?.data?.data?.firstName,
                        isDiscountUsed: response?.data?.data?.isDiscountUsed,
                        isVerify: response?.data?.data?.isVerify,
                        lastName: response?.data?.data?.lastName,
                        profilePicture: response?.data?.data?.profilePicture,
                        role: response?.data?.data?.role
                    })
                } else if (response?.data?.data?.role == 'SUPER_ADMIN') {
                    setKeepAuth({
                        firstName: response?.data?.data?.firstName,
                        lastName: response?.data?.data?.lastName,
                        profilePicture: response?.data?.data?.profilePicture,
                        role: response?.data?.data?.role,
                        totalWorker: response?.data?.data?.totalWorker,
                        orders: response?.data?.data?.orders,
                        email: response?.data?.data?.email,
                        store: response?.data?.data?.store
                    })
                } else {
                    setKeepAuth({
                        firstName: response?.data?.data?.firstName,
                        lastName: response?.data?.data?.lastName,
                        profilePicture: response?.data?.data?.profilePicture,
                        role: response?.data?.data?.role,
                        email: response?.data?.data?.email,
                        store: response?.data?.data?.store
                    })
                }

            } catch (error) { }
        }

        if (token) {
            handleKeepAuth()
        }
    }, [token, setKeepAuth])

    useEffect(() => {
        const getLocation = async (): Promise<void> => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude?.toString()}&lon=${longitude?.toString()}&format=json`)
                setDataUser(response?.data?.display_name)
            } catch (error) { }
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