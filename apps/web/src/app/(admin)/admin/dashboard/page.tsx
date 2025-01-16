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
import TabTracking from "@/features/superAdmin/components/TabOrderTracking";
import Notification from "@/components/core/notification";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NotificationOutletAdmin from "@/features/adminOutlet/components/Notification";
import NotificationSuperAdmin from "@/features/superAdmin/components/NotificationSuperAdmin";
import HeaderDashboardMobile from "@/components/core/headerDashboardMobile";
import IconMenuDashboardMobile from "@/components/core/iconMenuDashboardMobile";
import MenuAdditionalDashboardMobile from "@/components/core/MenuAdditionalDashboardMobile";
import WeatherMobile from "@/components/core/weatherMobile";
import HeaderAdminDashboardWeb from "@/components/core/headerDashboardWeb copy";
import WeatherWeb from "@/components/core/weatherWeb";
import { useAdminDashboardHook } from "@/features/superAdmin/hooks/useAdminDashboardHook";

export default function Page() {
    const {
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
    } = useAdminDashboardHook()

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
                    <HeaderDashboardMobile storeName={storeName} showStore={false} role={role} name={name} message={"Pantau data pekerja dan kelola produk laundry di satu tempat."} />
                    <IconMenuDashboardMobile arrIcon={arrIcon} cols="2" />

                    <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto">
                        <MenuAdditionalDashboardMobile arrMenu={arrMenu} />
                        <div className="w-full px-5 h-full bg-white bg-opacity-45 rounded-2xl flex items-center justify-center">
                            <MonthlyCharts monthlyData={dataOrderList?.monthlyStatistic} showDropdown={true} isLoading={isLoading}
                                onChange={(e: any) => setIsMonthlyStatistic(e.target.value)} value={isMonthlyStatistic} />
                        </div>
                        <TabTracking
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            dataOrder={dataOrder}
                        />
                        <div className="w-full md:w-1/2 h-auto bg-gradient-to-tr from-sky-100 via-orange-100 to-white p-4 rounded-2xl shadow-md">
                            <WeatherMobile isCurrentWeather={isCurrentWeather} />
                        </div>
                    </div>

                    <div className="w-full h-fit py-5 mt-5 rounded-xl border bg-white shadow-sm">
                        <ChartComponents completedOrders={completedOrders} pendingOrders={pendingOrders} />
                    </div>
                </main>
            </ContentMobileLayout>


            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
                <section className="w-full h-1/2 rounded-xl flex gap-2">
                    <HeaderAdminDashboardWeb isDayArr={isDayArr} isDay={isDay} isDate={isDate} name={name} storeName={storeName} dataOrderNotif={dataOrderNotif} />

                    <div className="w-full rounded-xl h-full bg-gradient-to-tr from-sky-100 via-orange-100 to-white p-2 gap-2 flex items-center">
                        <WeatherWeb isCurrentWeather={isCurrentWeather} />

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
                    <MonthlyCharts monthlyData={dataOrderList?.monthlyStatistic} showDropdown={true} isLoading={isLoading}
                        onChange={(e: any) => setIsMonthlyStatistic(e.target.value)} value={isMonthlyStatistic} />
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
