'use client'

import { FaHistory } from "react-icons/fa";
import { FaDashcube, FaBoxOpen, FaTruck } from "react-icons/fa6";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import LoadingDashboardWeb from "@/components/core/loading/loadingDashboardWeb";
import NotificationDriver from "@/features/driver/components/Notification";
import { useDriverDashboardHook } from "@/features/driver/hooks/useDriverDashboardHook";
import HeaderDashboardMobile from "@/components/core/HeaderDashboardMobile";
import WeatherMobile from "@/components/core/WeatherMobile";
import IconMenuDashboardMobile from "@/components/core/IconMenuDashboardMobile";
import HeaderDashboardWeb from "@/components/core/HeaderDashboardWeb";
import WeatherWeb from "@/components/core/WeatherWeb";
import WidgetDashboardMobile from "@/features/driver/components/WidgetDashboardMobile";
import WidgetDashboardWeb from "@/features/driver/components/WidgetDashboardWeb";


export default function Page() {
    const {
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
    } = useDriverDashboardHook();


    if (dataOrderAwaitingPickupPending && dataOrderDeliveryPending) return (
        <>
            <LoadingDashboardWeb />
        </>
    )

    const arrIcon = [
        { icon: <FaDashcube />, url: '/worker/driver/dashboard', name: 'Dashboard' },
        { icon: <FaTruck />, url: '/worker/driver/delivery-request', name: 'Pengantaran' },
        { icon: <FaBoxOpen />, url: '/worker/driver/pickup-request', name: 'Penjemputan' },
        { icon: <FaHistory />, url: '/worker/driver/history', name: 'Riwayat' },
    ]

    return (
        <>
            <ContentMobileLayout title="Dashboard" icon={<FaDashcube className="text-lg" />} notification={<NotificationDriver dataOrderNotif={dataOrderNotif} />} >
                <main className="pb-28">
                    <HeaderDashboardMobile storeName={storeName} role={role} name={name} message={"Pantau permintaan pengantaran dan penjemputan di satu tempat dengan mudah."} />
                    <IconMenuDashboardMobile arrIcon={arrIcon} cols="2" />

                    <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto">
                        <WeatherMobile isCurrentWeather={isCurrentWeather} />
                        <WidgetDashboardMobile link={'/worker/driver/pickup-request?tab=proses'} title={"Pengantaran Laundry"} data={dataOrderAwaitingPickup} />
                        <WidgetDashboardMobile link={'/worker/driver/delivery-request?tab=proses'} title={"Penjemputan Laudry"} data={dataOrderDelivery} />
                    </div>
                </main>
            </ContentMobileLayout>

            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex flex-col">
                <section className="w-full h-1/2 rounded-xl flex gap-2">
                    <HeaderDashboardWeb isDayArr={isDayArr} isDay={isDay} isDate={isDate} name={name} storeName={storeName} message={"Pantau permintaan pengantaran dan penjemputan di satu tempat dengan mudah."} />
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
                <section className="w-full h-1/2 flex bg-gradient-to-tr from-sky-100 via-orange-100 to-white rounded-xl p-5 gap-2">
                    <WidgetDashboardWeb title={"Pengantaran Laundry"} data={dataOrderAwaitingPickup} dataOrderNotif={dataOrderNotif} />
                    <WidgetDashboardWeb title={"Penjemputan Laundry"} data={dataOrderDelivery} dataOrderNotif={dataOrderNotif} />
                </section>
            </main>
        </>
    );
}
