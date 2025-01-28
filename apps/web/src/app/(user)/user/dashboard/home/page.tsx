'use client'

import { FaBox, FaCartShopping } from "react-icons/fa6";
import { FaDashcube, FaSpaghettiMonsterFlying } from "react-icons/fa6";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import LoadingDashboardWeb from "@/components/core/loadingCustom/loadingDashboardWeb";
import TabTrackingUser from "@/features/user/components/tabUserTracking";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import HeaderDashboardMobile from "@/components/core/headerDashboardMobile";
import IconMenuDashboardMobile from "@/components/core/iconMenuDashboardMobile";
import WeatherMobile from "@/components/core/weatherMobile";
import HeaderDashboardWeb from "@/components/core/headerDashboardWeb";
import WeatherWeb from "@/components/core/weatherWeb";
import NotificationUser from "@/features/user/components/notificationCustom";
import WidgetDashboardMobile from "@/features/user/components/widgetMobileDashboard";
import WidgetDashboardWeb from "@/features/user/components/widgetWebDashboard";
import { useUserDashboardHook } from "@/features/user/hooks/useUserDashboardHook";

export default function Page() {
    const { lat,
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
        dataOrderNotif,
        dataOrderUser,
        dataOrderUserPending,
        dataOrderPending } = useUserDashboardHook()

    if (dataOrderUserPending && dataOrderPending) return (
        <>
            <LoadingDashboardWeb />
        </>
    )

    const arrIcon = [
        { icon: <FaDashcube />, url: '/user/dashboard/home', name: 'Dashboard' },
        { icon: <FaBox />, url: '/user/dashboard/pickup', name: 'Permintaan Pickup' },
        { icon: <FaCartShopping />, url: '/user/dashboard/order', name: 'Pesanan' },
        { icon: <FaSpaghettiMonsterFlying />, url: '/user/dashboard/settings/', name: 'Pengaturan' },
    ]

    return (
        <>
            <ContentMobileLayout title="Dashboard" icon={<FaDashcube className="text-lg" />} notification={<NotificationUser dataOrderNotif={dataOrderNotif} />}>
                <HeaderDashboardMobile storeName={storeName} showStore={false} role={role} name={name} message={"Selamat datang di Clean&Click, layanan laundry profesional yang memastikan pakaian Anda selalu bersih dan rapi."} />
                <IconMenuDashboardMobile arrIcon={arrIcon} cols="2" />

                <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto pb-28">
                    <WeatherMobile isCurrentWeather={isCurrentWeather} />
                    <WidgetDashboardMobile title={"Menunggu Pembayaran"} data={dataOrderUser} />
                    <div className="w-full flex gap-3 justify-center items-center py-3 px-4 bg-white border rounded-lg shadow-sm transition-all">
                        <TabTrackingUser
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            dataOrder={dataOrder}
                        />
                    </div>
                </div>
            </ContentMobileLayout >

            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
                <section className="w-full h-1/2 rounded-xl flex gap-2">
                    <HeaderDashboardWeb isDayArr={isDayArr} isDay={isDay} isDate={isDate} name={name} storeName={storeName} message={"Selamat datang di Clean&Click, layanan laundry profesional yang memastikan pakaian Anda selalu bersih dan rapi."} />
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
                    <WidgetDashboardWeb title={"Menunggu Pembayaran"} data={dataOrderUser} dataOrderNotif={dataOrderNotif} />

                    <div className="w-full h-full flex justify-center p-5 bg-white bg-opacity-45 rounded-2xl ">
                        <TabTrackingUser
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            dataOrder={dataOrder}
                        />
                    </div>
                </section>
            </main>
        </>
    );
}
