'use client'

import authStore from "@/zustand/authoStore";
import { useEffect, useState } from "react";
import { instance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";

export const useAdminOutletDashboardHook = () => {
    const name = authStore((state) => state?.firstName)
    const lat = locationStore((state) => state?.latitude)
    const role = authStore((state) => state?.role)
    const lng = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const storeName = authStore((state) => state?.store)
    const [isDate, setIsDate] = useState<string>('')
    const [isDay, setIsDay] = useState<number>(0)
    const [isCurrentWeather, setIsCurrentWeather] = useState<any>({})
    const [date, setDate] = useState<Date | undefined>(new Date())
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

    const { data: dataOrder } = useQuery({
        queryKey: ['get-order-status', selectedTab],
        queryFn: async () => {
            const res = await instance.get(`/order/tracking?period=${selectedTab}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data
        },
    });
    const { data: dataOrderList, refetch, isLoading } = useQuery({
        queryKey: ['get-order'],
        queryFn: async () => {
            const res = await instance.get(`/order/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(dataOrderList)
            return res?.data?.data
        },
    });

    const { data: dataOrderNotif } = useQuery({
        queryKey: ['get-order-notif'],
        queryFn: async () => {
            const res = await instance.get('/order/notification', {
                params: { tab: 'admin' },
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
                } catch (error) {
                    
                }
            }

            handleCurrentWeither()
        }
    }, [lat, lng])



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
        dataOrder,
        dataOrderList,
        dataOrderNotif,
        refetch,
        isLoading,
    }
}