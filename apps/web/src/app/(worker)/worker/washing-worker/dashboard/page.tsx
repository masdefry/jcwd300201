'use client'

import { FaDashcube, FaMoneyBillWave, FaSpaghettiMonsterFlying } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import LoadingDashboardWeb from "@/components/core/loadingCustom/loadingDashboardWeb";
import Notification from "@/components/core/notificationCustom";
import { useWashingDashboardHook } from "@/features/washingWorker/hooks/useWashingDashboardHook";
import HeaderDashboardMobile from "@/components/core/headerDashboardMobile";
import IconMenuDashboardMobile from "@/components/core/iconMenuDashboardMobile";
import WeatherMobile from "@/components/core/weatherMobile";
import HeaderDashboardWeb from "@/components/core/headerDashboardWeb";
import WeatherWeb from "@/components/core/weatherWeb";
import WidgetDashboardWeb from "@/features/washingWorker/components/widgetWebDashboardComponent";
import WidgetDashboardMobile from "@/features/washingWorker/components/widgetMobileDashboard";

export default function Page() {
    const {
        name,
        lat,
        lng,
        token,
        role,
        storeName,
        isDate,
        isDay,
        isCurrentWeather,
        dataOrderWashing,
        dataOrderWashingNotif,
        dataOrderWashingPending,
        isDayArr,
        date, setDate
    } = useWashingDashboardHook();

    const arrIcon = [
        { icon: <FaDashcube />, url: '/worker/washing-worker/dashboard', name: 'Dashboard' },
        { icon: <FaMoneyBillWave />, url: '/worker/washing-worker/order', name: 'Pesanan' },
        { icon: <FaHistory />, url: '/worker/washing-worker/history', name: 'Riwayat' },
        { icon: <FaSpaghettiMonsterFlying />, url: '/worker/washing-worker/settings', name: 'Pengaturan' },

    ]

    if (dataOrderWashingPending) return (
        <>
            <LoadingDashboardWeb />
        </>
    )
    return (
        <>
            <ContentMobileLayout title="Dashboard" icon={<FaDashcube className="text-lg" />} notification={<Notification dataOrderNotif={dataOrderWashingNotif} />}>
                <HeaderDashboardMobile storeName={storeName} role={role} name={name} message={"Pantau permintaan cuci, status pencucian, dan riwayat pekerjaan di satu tempat dengan mudah."} />
                <IconMenuDashboardMobile arrIcon={arrIcon} cols="2" />

                <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto">
                    <WeatherMobile isCurrentWeather={isCurrentWeather} />
                    <WidgetDashboardMobile title={"Proses Mencuci"} data={dataOrderWashing} />
                </div>
            </ContentMobileLayout >

            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
                <section className="w-full h-1/2 rounded-xl flex gap-2">
                    <HeaderDashboardWeb isDayArr={isDayArr} isDay={isDay} isDate={isDate} name={name} storeName={storeName} message={"Pantau permintaan cuci, status pencucian, dan riwayat pekerjaan di satu tempat dengan mudah."} />
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
                    <WidgetDashboardWeb title={"Proses Mencuci"} data={dataOrderWashing} dataOrderNotif={dataOrderWashingNotif} />
                </section>
            </main>
        </>
    );
}
