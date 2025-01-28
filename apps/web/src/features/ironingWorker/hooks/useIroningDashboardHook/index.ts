import authStore from "@/zustand/authoStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";
import { instance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";


export const useIroningDashboardHook = () => {
    const name = authStore((state) => state?.firstName)
    const role = authStore((state) => state?.role)
    const lat = locationStore((state) => state?.latitude)
    const lng = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const storeName = authStore((state) => state?.store)
    const [isDate, setIsDate] = useState<string>('')
    const [isDay, setIsDay] = useState<number>(0)
    const [isCurrentWeather, setIsCurrentWeather] = useState<any>({})
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');


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

    const { data: dataOrderIroning, isPending: dataOrderIroningPending } = useQuery({
        queryKey: ['get-order-ironing'],
        queryFn: async () => {
            const res = await instance.get(`/order/order-ironing`, {
                params: { tab: 'proses-setrika' },
                headers: { Authorization: `Bearer ${token}` }
            });

            return res?.data?.data;
        },
    })
    const { data: dataOrderIroningNotif } = useQuery({
        queryKey: ['get-order-ironing-notif'],
        queryFn: async () => {
            const res = await instance.get(`/order/order-ironing`, {
                params: { tab: 'belum-disetrika' },
                headers: { Authorization: `Bearer ${token}` }
            });

            return res?.data?.data;
        },
    })

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
        name,
        lat,
        lng,
        token,
        storeName,
        isDate,
        isDay,
        isCurrentWeather,
        dataOrderIroning,
        dataOrderIroningPending,
        dataOrderIroningNotif,
        isDayArr,
        date, setDate, role
    };

}