import authStore from "@/zustand/authoStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";
import { instance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";


export const usePackingDashboardHook = () => {
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

    const { data: dataOrderPacking, isPending: dataOrderPackingPending } = useQuery({
        queryKey: ['get-order-packing'],
        queryFn: async () => {
            const res = await instance.get(`/order/order-packing`, {
                params: { tab: 'packing-process' },
                headers: { Authorization: `Bearer ${token}` }
            });

            return res?.data?.data;
        },
    });
    const { data: dataOrderPackingNotif } = useQuery({
        queryKey: ['get-order-notif'],
        queryFn: async () => {
            const res = await instance.get(`/order/order-packing`, {
                params: { tab: 'not-packed-yet' },
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

    return {
        name,
        lat,
        lng,
        token,
        storeName,
        isDate,
        isDay,
        isCurrentWeather,
        dataOrderPacking,
        dataOrderPackingPending,
        dataOrderPackingNotif,
        isDayArr,
        date, setDate, role
    };

}