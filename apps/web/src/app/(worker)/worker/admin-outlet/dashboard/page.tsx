'use client'

import { FaExclamationTriangle } from "react-icons/fa";
import ChartComponents from "@/components/core/chart/pieChartTrackingStatusOrder";
import { FaDashcube, FaFileInvoice, FaMoneyBillWave, FaRegCreditCard, FaTruck } from "react-icons/fa6";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import MonthlyCharts from "@/components/core/chart/chartMonthlyStatistic";
import LoadingDashboardWeb from "@/components/core/loadingCustom/loadingDashboardWeb";
import TabTracking from "@/features/superAdmin/components/tabOrderTracking";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import HeaderDashboardMobile from "@/components/core/headerDashboardMobile";
import IconMenuDashboardMobile from "@/components/core/iconMenuDashboardMobile";
import WeatherMobile from "@/components/core/weatherMobile";
import WeatherWeb from "@/components/core/weatherWeb";
import { useAdminOutletDashboardHook } from "@/features/adminOutlet/hooks/useAdminOutletDashboardHook";
import HeaderAdminDashboardWeb from "@/components/core/headerAdminDashboardComponent";
import { IOrder } from "@/app/(admin)/admin/order/type";
import NotificationOutletAdmin from "@/features/adminOutlet/components/notification";

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
        dataOrderList,
        dataOrderNotif,
        refetch,
        isLoading } = useAdminOutletDashboardHook()

    const completedOrders = dataOrderList?.trackingOrder?.filter((order: IOrder) => order?.isConfirm);
    const pendingOrders = dataOrderList?.trackingOrder?.filter((order: IOrder) => !order?.isDone);


    if (isLoading) return (
        <>
            <LoadingDashboardWeb />
        </>
    )

    const arrIcon = [
        { icon: <FaDashcube />, url: '/worker/admin-outlet/dashboard', name: 'Dashboard' },
        { icon: <FaFileInvoice />, url: '/worker/admin-outlet/nota-order', name: 'Buat Nota' },
        { icon: <FaTruck />, url: '/worker/admin-outlet/delivery', name: 'Pengantaran' },
        { icon: <FaMoneyBillWave />, url: '/worker/admin-outlet/order', name: 'Pesanan' },
        { icon: <FaRegCreditCard />, url: '/worker/admin-outlet/payment', name: 'Pembayaran' },
        { icon: <FaExclamationTriangle />, url: '/worker/admin-outlet/report', name: 'Laopran' },
    ]

    return (
        <>
            <ContentMobileLayout title="Dashboard" icon={<FaDashcube className="text-lg" />} notification={<NotificationOutletAdmin dataOrderNotif={dataOrderNotif} />}>
                <main className="pb-28">
                    <HeaderDashboardMobile storeName={storeName} role={role} name={name} message={"Pantau data pekerja dan kelola produk laundry di satu tempat."} />
                    <IconMenuDashboardMobile arrIcon={arrIcon} cols="3" />

                    <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto">
                        <div className="w-full flex gap-3 justify-center items-center py-3 px-4 bg-white border rounded-lg shadow-sm transition-all">
                            <TabTracking
                                selectedTab={selectedTab}
                                setSelectedTab={setSelectedTab}
                                dataOrder={dataOrder}
                            />
                        </div>
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
                    <div className="w-full px-5 h-full bg-white bg-opacity-45 rounded-2xl flex items-center justify-center">
                        <MonthlyCharts monthlyData={dataOrderList?.monthlyStatistic} />
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
