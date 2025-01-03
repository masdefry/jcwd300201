'use client'

import { MdFeedback, MdOutlineIron, MdWorkHistory } from "react-icons/md";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { FaCartArrowDown, FaDashcube, FaMoneyBillWave, FaMotorcycle, FaSpaghettiMonsterFlying, FaStore } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { FaHistory, FaTint, FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import authStore from "@/zustand/authstore";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { FaCloud, FaTemperatureHigh } from "react-icons/fa6";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";
import Link from "next/link";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import { RiProfileFill } from "react-icons/ri";

const iconButtons = [
    { icon: BsPerson, label: "Admin Outlet" },
    { icon: CgSmartHomeWashMachine, label: "Cuci" },
    { icon: MdOutlineIron, label: "Setrika" },
    { icon: FaMotorcycle, label: "Driver" },
];

export default function Page() {
    const name = authStore((state) => state?.firstName)
    const lat = locationStore((state) => state?.latitude)
    const lng = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const [isDate, setIsDate] = useState<string>('')
    const [isDay, setIsDay] = useState<number>(0)
    const [isCurrentWeither, setIsCurrentWeither] = useState<any>({})
    const [date, setDate] = useState<Date | undefined>(new Date())


    useEffect(() => {
        if (lat && lng) {
            const handleCurrentWeither = async () => {
                try {
                    const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${process.env.NEXT_PUBLIC_OPEN_WEITHER}&lang=id`)

                    setIsCurrentWeither(res?.data)
                } catch (error) {
                    console.log(error)
                }
            }

            handleCurrentWeither()
        }
    }, [lat, lng])

    const isDayArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

    useEffect(() => {
        const date = new Date()
        const isDayNow = date.getDay()
        const isDateNow = date.getDate()
        const isMonth = date.getMonth()
        const isYear = date.getFullYear()

        const newDateFormat = `${isDateNow}/${isMonth}/${isYear}`
        setIsDate(newDateFormat)
        setIsDay(isDayNow)
    }, [])

    const arrIcon = [
        { icon: <FaDashcube />, url: '/worker/ironing-worker/dashboard', name: 'Dashboard' },
        { icon: <FaMoneyBillWave />, url: '/worker/ironing-worker/order', name: 'Pesanan' },
        { icon: <FaHistory />, url: '/worker/ironing-worker/history', name: 'Riwayat' },
        { icon: <FaSpaghettiMonsterFlying />, url: '/worker/ironing-worker/settings', name: 'Pengaturan' },
    ]

    return (
        <>
            <ContentMobileLayout title='Dashboard' icon={<FaDashcube className='text-xl' />}>
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
                    <div className="w-full md:w-1/2 h-auto bg-gradient-to-tr from-sky-100 via-orange-100 to-white p-4 rounded-2xl shadow-md">
                        <div className="h-full bg-white bg-opacity-70 rounded-lg p-4">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Status Cuaca</h2>
                            <p className="text-sm text-gray-600">
                                {isCurrentWeither?.weather && isCurrentWeither.weather[0]?.description
                                    ? `${isCurrentWeither.weather[0].description}, ${(
                                        isCurrentWeither.main.temp - 273.15
                                    ).toFixed(1)}°C`
                                    : "Data cuaca tidak tersedia"}
                            </p>
                        </div>
                    </div>
                </div>
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
                            </div>
                        </div>
                        <div className="w-full h-full items-center flex justify-end">
                            <Image
                                className="h-[80%] w-fit"
                                width={500}
                                height={500}
                                loading="lazy"
                                alt="logo"
                                src={'/images/charr.png'} />
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
                    <div className="w-full h-full space-y-2 rounded-2xl">
                        <Link href='/admin-outlet/nota-order' className="w-full py-2 flex items-center justify-between bg-white bg-opacity-45 rounded-full px-3">
                            <h1 className="text-neutral-600 font-semibold hover:text-neutral-700">Buat Nota Pesanan</h1>
                            <span className="p-2 rounded-full hover:animate-wiggle-more bg-neutral-400"><FaArrowRight className="text-white text-xl" /> </span>
                        </Link>
                    </div>
                    <div className="w-full h-full bg-white bg-opacity-45 rounded-2xl"></div>
                    <div className="w-full h-full bg-white bg-opacity-45 rounded-2xl"></div>
                </section>
            </main>
        </>
    );
}
