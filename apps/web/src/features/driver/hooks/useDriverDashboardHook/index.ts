'use client'

import authStore from "@/zustand/authoStore";
import { useEffect, useState } from "react";
import { instance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";

export const useDriverDashboardHook = () => {
    const lat = locationStore((state) => state?.latitude)
    const lng = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const name = authStore((state) => state?.firstName)
    const storeName = authStore((state) => state?.store)
    const role = authStore((state) => state?.role)
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isDate, setIsDate] = useState<string>('')
    const [isCurrentWeather, setIsCurrentWeather] = useState<any>({})
    const [isDay, setIsDay] = useState<number>(0)
    const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');
    const isDayArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

    useEffect(() => {
        const date = new Date()
        const isDayNow = date.getDay()
        const isDateNow = date.getDate()
        const isMonth = date.getMonth()
        const isYear = date.getFullYear()

        const newDateFormat = `${isDateNow}/${(isMonth + 1) < 10 ? `0${isMonth + 1}` : (isMonth + 1)}/${isYear}`
        setIsDate(newDateFormat)
        setIsDay(isDayNow)
    }, [])

    const { data: dataOrderAwaitingPickup, isPending: dataOrderAwaitingPickupPending } = useQuery({
        queryKey: ['get-order-request'],
        queryFn: async () => {
            const res = await instance.get('/order/order', {
                params: { tab: 'AWAITING_DRIVER_PICKUP' },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { data: dataOrderDelivery, isPending: dataOrderDeliveryPending } = useQuery({
        queryKey: ['get-order-proses'],
        queryFn: async () => {
            const res = await instance.get(`/order/delivery`, {
                params: { tab: 'waiting-driver' },
                headers: { Authorization: `Bearer ${token}` }
            });

            return res?.data?.data;
        },
    });
    const { data: dataOrderNotif } = useQuery({
        queryKey: ['get-order-notif'],
        queryFn: async () => {
            const res = await instance.get('/order/notification', {
                params: { tab: 'driver' },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    useEffect(() => {
        if (lat && lng) {
            const handleCurrentWeither = async () => {
                try {
                    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_OPEN_WEITHER}&lang=id`)

                    setIsCurrentWeather(res?.data)
                } catch (error) { }
            }

            handleCurrentWeither()
        }
    }, [lat, lng])


    useEffect(() => {
        const date = new Date()
        const isDayNow = date.getDay()
        const isDateNow = date.getDate()
        const isMonth = date.getMonth()
        const isYear = date.getFullYear()

        const newDateFormat = `${isDateNow}/${(isMonth + 1) <= 9 ? `0${isMonth + 1}` : (isMonth + 1)}/${isYear}`
        setIsDate(newDateFormat)
        setIsDay(isDayNow)
    }, [])



    return {
        lat,
        lng,
        token,
        name,
        storeName,
        date,
        setDate,
        isDate,
        isCurrentWeather,
        isDay,
        role,
        selectedTab,
        setSelectedTab,
        isDayArr,
        dataOrderAwaitingPickup,
        dataOrderDelivery,
        dataOrderNotif,
        dataOrderAwaitingPickupPending,
        dataOrderDeliveryPending
    }
}