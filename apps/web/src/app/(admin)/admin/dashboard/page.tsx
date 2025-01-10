'use client'

import { IoSearchSharp, IoPersonSharp } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { FaTint } from "react-icons/fa";
import { MdFeedback, MdWorkHistory } from "react-icons/md";
import Image from "next/image";
import authStore from "@/zustand/authstore";
import { useEffect, useState } from "react";
import { FaCartArrowDown, FaDashcube, FaMoneyBillWave, FaSpaghettiMonsterFlying, FaStore } from "react-icons/fa6";
import { FaCloud, FaTemperatureHigh } from "react-icons/fa6";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";
import Link from "next/link";
import { instance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import ChartComponents from "@/components/core/chart/pieChartTrackingStatusOrder";
import MonthlyCharts from "@/components/core/chart/chartMonthlyStatistic";
import LoadingDashboardWeb from "@/components/core/loading/loadingDashboardWeb";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import { RiProfileFill } from "react-icons/ri";
import TabTracking from "@/features/superAdmin/components/tabOrderTracking";
import Notification from "@/components/core/notification";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NotificationOutletAdmin from "@/features/adminOutlet/components/notification";
import NotificationSuperAdmin from "@/features/superAdmin/components/notification";

export default function Page() {
    const name = authStore((state) => state?.firstName)
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
    const [isCurrentWeither, setIsCurrentWeither] = useState<any>({})
    const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');
    const [isMonthlyStatistic, setIsMonthlyStatistic] = useState<string>(currentUrl.get('outlet') || '')


    const { data: dataOrder } = useQuery({
        queryKey: ['get-order-status', selectedTab],
        queryFn: async () => {
            const res = await instance.get(`/order/tracking?period=${selectedTab}`, {
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

    const { data: dataOrderList, refetch, isPending } = useQuery({
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

                    setIsCurrentWeither(res?.data)
                } catch (error) {
                    console.log('error')
                }
            }

            handleCurrentWeither()
        }
    }, [lat, lng])

    const iconButtons = [
        { icon: FaStore, label: "Data Outlet" },
        { icon: IoSearchSharp, label: "Cari Pesanan" },
        { icon: IoPersonSharp, label: "Data Pelanggan" },
        { icon: GrUserWorker, label: "Data Pekerja" },
    ];

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
        if (isMonthlyStatistic) {
            currentUrl.set('outlet', isMonthlyStatistic)
        } else {
            currentUrl.delete('outlet')
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        router.refresh()
        refetch()

    }, [refetch, pathname, router, isMonthlyStatistic, params])

    const completedOrders = dataOrderList?.trackingOrder?.filter((order: any) => order?.isConfirm);
    const pendingOrders = dataOrderList?.trackingOrder?.filter((order: any) => !order?.isDone);


    if (isPending) return (
        <>

            <LoadingDashboardWeb />
        </>
    )

    const arrIcon = [
        { icon: <FaDashcube />, url: '/admin/dashboard', name: 'Dashboard' },
        { icon: <FaStore />, url: '/admin/outlet', name: 'Outlet' },
        { icon: <FaMoneyBillWave />, url: '/admin/order', name: 'Pesanan' },
        { icon: <FaSpaghettiMonsterFlying />, url: '/admin/settings', name: 'Pengaturan' },
    ]

    const arrMenu = [
        { icon: <FaCartArrowDown />, url: '/admin/product', name: 'Produk' },
        { icon: <MdFeedback />, url: '/admin/contact', name: 'Umpan Balik' },
        { icon: <MdWorkHistory />, url: '/admin/worker', name: 'Kelola Pekerja' },
        { icon: <RiProfileFill />, url: '/admin/settings/account', name: 'Kelola Profil' },
    ]

    return (
        <>
            <ContentMobileLayout title="Dashboard" icon={<FaDashcube className="text-lg" />} notification={<NotificationSuperAdmin dataOrderNotif={dataOrderNotif} />}>
                <main className="pb-28">
                    <div className="w-full h-fit py-5 flex flex-col px-5 bg-orange-500 rounded-3xl shadow-md">
                        <h1 className="text-white font-bold text-xl">Hello, {name && name?.length > 10 ? name?.slice(0, 10) : name || "Admin"}!</h1>
                        <p className="text-neutral-200 text-sm mt-1">Pantau data pekerja dan kelola produk laundry di satu tempat.</p>
                    </div>
                    <div className="flex justify-center h-fit w-full p-2 mt-5 bg-gradient-to-tr from-white via-sky-50 to-sky-100 rounded-2xl">
                        <div className="grid grid-cols-4 gap-2 w-full">
                            {arrIcon?.map((item: any, i: number) => (
                                <Link href={item?.url} className="w-full p-3 flex flex-col items-center justify-center gap-2 bg-white shadow-sm border rounded-2xl hover:shadow-md transition-all" key={i}>
                                    <span className="text-2xl text-orange-500">{item?.icon}</span>
                                    <h1 className="text-xs text-gray-700">{item?.name}</h1>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto">
                        <div className="w-full md:w-1/2 h-auto">
                            <div className="grid grid-cols-1 gap-3 w-full">
                                {arrMenu?.map((menu, i) => (
                                    <Link href={menu?.url} key={i} className="w-full flex gap-3 items-center py-3 px-4 bg-white border rounded-lg shadow-sm hover:bg-gray-100 transition-all">
                                        <span className="text-lg text-neutral-500">{menu?.icon}</span>
                                        <span className="text-sm text-neutral-700">{menu?.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <TabTracking
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            dataOrder={dataOrder}
                        />
                        <div className="w-full md:w-1/2 h-auto bg-gradient-to-tr from-sky-100 via-orange-100 to-white p-4 rounded-2xl shadow-md">
                            <div className="h-full bg-white bg-opacity-70 rounded-lg p-4">
                                <h2 className="text-lg font-semibold text-gray-700 mb-2">Status Cuaca</h2>
                                <p className="text-sm text-gray-600">
                                    {isCurrentWeither?.weather && isCurrentWeither.weather[0]?.description
                                        ? `${isCurrentWeither.weather[0].description}, ${(isCurrentWeither.main.temp - 273.15).toFixed(1)}°C`
                                        : "Data cuaca tidak tersedia"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-fit py-5 mt-5 rounded-xl border bg-white shadow-sm">
                        <ChartComponents completedOrders={completedOrders} pendingOrders={pendingOrders} />
                    </div>
                </main>
            </ContentMobileLayout>


            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
                <section className="w-full h-1/2 rounded-xl flex gap-2">
                    <div className="w-full rounded-xl h-full flex items-center bg-orange-500 p-5">
                        <div className="w-full h-fit">
                            <div className="w-fit h-fit pb-5">
                                <h1 className='font-bold border-b text-xl text-white pb-2'>Welcome, {name && name?.length > 10 ? name?.slice(0, 10) : name || 'Admin'}!</h1>
                            </div>
                            <div className="w-full">
                                <p className="text-white">Pantau data pekerja dan kelola produk laundry di satu tempat.</p>
                                <p className="text-white pt-2">{isDayArr[isDay]} {isDate || '00/00/0000'}</p>
                                <p className="text-white pt-2 flex gap-2 items-center"><span><FaStore className='text-lg' /></span> {storeName || 'CNC - Example'}</p>
                            </div>
                        </div>
                        <div className="w-full h-full items-center flex justify-end">
                            <Image
                                className="h-[80%] w-fit"
                                width={500}
                                height={500}
                                loading="lazy"
                                alt="logo"
                                src={'/images/charr.png'}
                            />
                        </div>
                        <div className="flex h-full items-start">
                            <NotificationSuperAdmin dataOrderNotif={dataOrderNotif} />
                        </div>
                    </div>
                    <div className="w-full rounded-xl h-full bg-gradient-to-tr from-sky-100 via-orange-100 to-white p-2 gap-2 flex items-center">
                        <div className="w-1/2 h-full flex items-center px-2 flex-col justify-center rounded-xl bg-white bg-opacity-45">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-gray-700">Status Cuaca</h2>
                                <div className="flex justify-center items-center py-4">
                                    {isCurrentWeither?.weather ? (
                                        <p className='text-6xl text-neutral-700 font-bold'> {isCurrentWeither?.main?.temp
                                            ? `${(isCurrentWeither.main.temp - 273.15).toFixed(1)}°C`
                                            : '- °C'}
                                        </p>
                                    ) : (
                                        <span className="text-gray-500">Cuaca tidak tersedia</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <p className="text-lg text-gray-600">
                                    {isCurrentWeither?.weather && isCurrentWeither.weather[0]?.description
                                        ?
                                        <span className='flex gap-2 items-center '>
                                            <FaCloud className="text-gray-200" />
                                            {isCurrentWeither.weather[0].description.toUpperCase()}
                                        </span>
                                        : 'Data cuaca tidak tersedia'}
                                </p>
                            </div>
                            <div className="py-4 space-y-2 w-full">
                                <div className="flex items-center space-x-3 bg-white bg-opacity-70 w-full py-1 px-4 rounded-full">
                                    <FaTint className="text-neutral-400" />
                                    <p className="text-neutral-700 text-sm">{isCurrentWeither?.main?.humidity ? `${isCurrentWeither.main.humidity}%` : '- %'}</p>
                                </div>
                                <div className="flex items-center space-x-3 bg-white bg-opacity-70 w-full py-1 px-4 rounded-full">
                                    <FaTemperatureHigh className="text-neutral-400" />
                                    <p className="text-neutral-700 text-sm"> {isCurrentWeither?.main?.temp
                                        ? `${(isCurrentWeither.main.temp - 273.15).toFixed(1)}°C`
                                        : '- °C'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-1/2 h-full bg-white bg-opacity-45 rounded-xl">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full flex gap-2 h-1/2 bg-gradient-to-tr from-sky-100 via-orange-100 to-white rounded-xl p-2">
                    <div className="w-full px-5 h-full bg-white bg-opacity-45 rounded-2xl flex items-center justify-center">
                        <MonthlyCharts monthlyData={dataOrderList?.monthlyStatistic} showDropdown={true} isPending={isPending}
                            onChange={(e: any) => setIsMonthlyStatistic(e.target.value)} value={isMonthlyStatistic} />
                    </div>
                    <div className="w-fit px-5 h-full bg-white bg-opacity-45 rounded-2xl flex items-center justify-center">
                        <TabTracking
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            dataOrder={dataOrder}
                        />
                    </div>
                    <div className="w-fit h-full bg-white bg-opacity-45 py-3 rounded-2xl flex items-center justify-center">
                        <ChartComponents completedOrders={completedOrders} pendingOrders={pendingOrders} />
                    </div>
                </section>
            </main>
        </>
    );
}
