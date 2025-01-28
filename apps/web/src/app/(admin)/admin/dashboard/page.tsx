'use client'

import { MdFeedback, MdWorkHistory } from "react-icons/md";
import { FaCartArrowDown, FaDashcube, FaMoneyBillWave, FaSpaghettiMonsterFlying, FaStore } from "react-icons/fa6";
import * as React from "react"
import { useAdminDashboardHook } from "@/features/superAdmin/hooks/useAdminDashboardHook";
import LoadingDashboardWeb from "@/components/core/loadingCustom/loadingDashboardWeb";
import { RiProfileFill } from "react-icons/ri";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import HeaderDashboardMobile from "@/components/core/headerDashboardMobile";
import IconMenuDashboardMobile from "@/components/core/iconMenuDashboardMobile";
import MenuAdditionalDashboardMobile from "@/components/core/menuAdditionalDashboardMob"
import MonthlyCharts from "@/components/core/chart/chartMonthlyStatistic";
import TabTracking from "@/features/superAdmin/components/tabOrderTracking";
import WeatherMobile from "@/components/core/weatherMobile";
import ChartComponents from "@/components/core/chart/pieChartTrackingStatusOrder";
import HeaderAdminDashboardWeb from "@/components/core/headerAdminDashboardComponent";
import WeatherWeb from "@/components/core/weatherWeb";
import { Calendar } from "@/components/ui/calendar";
import NotificationSuperAdmin from "@/features/superAdmin/components/notificationSuperAdminComponent";

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
        isMonthlyStatistic,
        refetchTab
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
        <React.Suspense fallback={<h1>loading...</h1>}>
            <ContentMobileLayout title="Dashboard" icon={<FaDashcube className="text-lg" />} notification={<NotificationSuperAdmin dataOrderNotif={dataOrderNotif} />}>
                <main className="pb-28">
                    <HeaderDashboardMobile storeName={storeName} showStore={false} role={role} name={name} message={"Pantau data pekerja dan kelola produk laundry di satu tempat."} />
                    <IconMenuDashboardMobile arrIcon={arrIcon} cols="2" />

                    <div className="w-full flex flex-col md:flex-row gap-4 px-2 mt-5 h-auto">
                        <MenuAdditionalDashboardMobile arrMenu={arrMenu} />
                        <div className="w-full px-5 h-full bg-white bg-opacity-45 rounded-2xl flex items-center justify-center">
                            <MonthlyCharts monthlyData={dataOrderList?.monthlyStatistic} showDropdown={true} isLoading={isLoading}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIsMonthlyStatistic(e.target.value)} value={isMonthlyStatistic} />
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
                    <div className="w-full px-5 h-full bg-white bg-opacity-45 rounded-2xl flex items-center justify-center">
                        <MonthlyCharts refetch={refetch} refetchTab={refetchTab} monthlyData={dataOrderList?.monthlyStatistic} showDropdown={true} isLoading={isLoading}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIsMonthlyStatistic(e.target.value)} value={isMonthlyStatistic} />
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
        </React.Suspense>
    );
}
