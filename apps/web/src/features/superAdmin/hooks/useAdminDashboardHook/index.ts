'use client'

import authStore from "@/zustand/authoStore";
import { useEffect, useState } from "react";
import { instance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IOrder } from "./type";

export const useAdminDashboardHook = () => {
    const name = authStore((state) => state?.firstName)
    const role = authStore((state) => state?.role)
    const lat = locationStore((state) => state?.latitude)
    const lng = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const storeName = authStore((state) => state?.store)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params.toString())
    const pathname = usePathname()
    const router = useRouter()

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [isDate, setIsDate] = useState<string>('')
    const [isDay, setIsDay] = useState<number>(0)
    const [isCurrentWeather, setIsCurrentWeather] = useState<any>({})
    const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');
    const [isMonthlyStatistic, setIsMonthlyStatistic] = useState<string>(currentUrl.get('outlet') || '')

    const outletId = isMonthlyStatistic ? isMonthlyStatistic : '';

    const { data: dataOrder, refetch: refetchTab } = useQuery({
        queryKey: ['get-order-status', selectedTab],
        queryFn: async () => {
            const res = await instance.get(`/order/tracking?period=${selectedTab}&outletId=${outletId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            return res?.data?.data
        },
    });

    const { data: getDataStore } = useQuery({
        queryKey: ['get-data-store'],
        queryFn: async () => {
            const res = await instance.get('/store')
            return res?.data?.data
        }
    })

    const { data: dataOrderList, refetch, isLoading, isPending } = useQuery({
        queryKey: ['get-order'],
        queryFn: async () => {
            const res = await instance.get(`/order/orders`, {
                params: {
                    outletId: isMonthlyStatistic || ''
                },
                headers: { Authorization: `Bearer ${token}` }
            });

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
                } catch (error) { }
            }

            handleCurrentWeither()
        }
    }, [lat, lng])


    const isDayArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

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

    useEffect(() => {
        const isUrl = new URLSearchParams(params?.toString())
        if (isMonthlyStatistic) {
            isUrl.set('outlet', isMonthlyStatistic)
        } else {
            isUrl.delete('outlet')
        }

        router.push(`${pathname}?${isUrl.toString()}`)
        router.refresh()
        refetch()
        refetchTab()

    }, [refetch, refetchTab, pathname, router, isMonthlyStatistic, params])

    const completedOrders = dataOrderList?.trackingOrder?.filter((order: IOrder) => order?.isConfirm);
    const pendingOrders = dataOrderList?.trackingOrder?.filter((order: IOrder) => !order?.isDone);

    return {
        completedOrders,
        pendingOrders,
        isPending,
        getDataStore,
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
        refetchTab,
        selectedTab,
        setSelectedTab,
        isDayArr,
        dataOrder,
        dataOrderList,
        dataOrderNotif,
        refetch,
        isLoading,
        setIsMonthlyStatistic,
        isMonthlyStatistic
    }
}