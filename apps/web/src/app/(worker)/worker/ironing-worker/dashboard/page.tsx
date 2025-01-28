'use client'

import { FaDashcube, FaMoneyBillWave, FaSpaghettiMonsterFlying } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import LoadingDashboardWeb from "@/components/core/loadingCustom/loadingDashboardWeb";
import Notification from "@/components/core/notificationCustom";
import { useIroningDashboardHook } from "@/features/ironingWorker/hooks/useIroningDashboardHook";
import HeaderDashboardMobile from "@/components/core/headerDashboardMobile";
import IconMenuDashboardMobile from "@/components/core/iconMenuDashboardMobile";
import WeatherMobile from "@/components/core/weatherMobile";
import HeaderDashboardWeb from "@/components/core/headerDashboardWeb";
import WeatherWeb from "@/components/core/weatherWeb";
import WidgetDashboardWeb from "@/features/ironingWorker/components/widgetWebDashboard";
import WidgetDashboardMobile from "@/features/ironingWorker/components/widgetMobileDashboard";

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
        dataOrderIroning,
        dataOrderIroningPending,
        dataOrderIroningNotif,
        isDayArr,
        date, setDate
    } = useIroningDashboardHook();

    const arrIcon = [
        { icon: <FaDashcube />, url: '/worker/ironing-worker/dashboard', name: 'Dashboard' },
        { icon: <FaMoneyBillWave />, url: '/worker/ironing-worker/order', name: 'Pesanan' },
        { icon: <FaHistory />, url: '/worker/ironing-worker/history', name: 'Riwayat' },
        { icon: <FaSpaghettiMonsterFlying />, url: '/worker/ironing-worker/settings', name: 'Pengaturan' },
    ]

    if (dataOrderIroningPending) return (
        <>
            <LoadingDashboardWeb />
        </>
    )

    return (
        <>
            <ContentMobileLayout title='Dashboard' icon={<FaDashcube className='text-xl' />} notification={<Notification dataOrderNotif={dataOrderIroningNotif} />}>

                <HeaderDashboardMobile storeName={storeName} role={role} name={name} message={"Pantau permintaan serta status setrika, dan riwayat pekerjaan di satu tempat dengan mudah."} />
                <IconMenuDashboardMobile arrIcon={arrIcon} cols="2" />

                <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto">
                    <WeatherMobile isCurrentWeather={isCurrentWeather} />
                    <WidgetDashboardMobile title={"Proses Setrika"} data={dataOrderIroning} />
                </div>
            </ContentMobileLayout >

            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
                <section className="w-full h-1/2 rounded-xl flex gap-2">
                    <HeaderDashboardWeb isDayArr={isDayArr} isDay={isDay} isDate={isDate} name={name} storeName={storeName} message={"Pantau permintaan serta status setrika, dan riwayat pekerjaan di satu tempat dengan mudah."} />

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
                    <WidgetDashboardWeb title={"Proses Setrika"} data={dataOrderIroning} dataOrderNotif={dataOrderIroningNotif} />
                </section>
            </main>
        </>
    );
}
