'use client'

import Image from "next/image";
import { MdOutlineIron } from "react-icons/md";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { FaMotorcycle } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { FaTint, FaWhatsapp } from "react-icons/fa";
import authStore from "@/zustand/authstore";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { FaCloud, FaTemperatureHigh } from "react-icons/fa6";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios";
import { locationStore } from "@/zustand/locationStore";
import Link from "next/link";


export default function Page() {
    const name = authStore((state) => state?.firstName)
    const lat = locationStore((state) => state?.latitude)
    const lng = locationStore((state) => state?.longitude)
    const token = authStore((state) => state?.token)
    const [isDate, setIsDate] = useState<string>('')
    const [isDay, setIsDay] = useState<number>(0)
    const [isCurrentWeither, setIsCurrentWeither] = useState<any>({})
    const [date, setDate] = useState<Date | undefined>(new Date())

    const isDayArr = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const iconButtons = [
        { icon: BsPerson, label: "Admin Outlet" },
        { icon: CgSmartHomeWashMachine, label: "Cuci" },
        { icon: MdOutlineIron, label: "Setrika" },
        { icon: FaMotorcycle, label: "Driver" },
    ];

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

    return (
        <>
            <main className="w-full h-fit">
                <div className="w-full h-fit md:hidden block md:max-w-full max-w-[425px]">
                    <section>
                        <Image src={'/images/New Project.webp'} alt="header"
                            height={500} width={500} />
                    </section>
                    {/* Header Image */}

                    {/* Location Section */}
                    <section className="border border-gray-400 rounded-t-lg p-3 mt-4 mx-8">
                        <div className="flex justify-center items-center">
                            <div className="font-semibold text-gray-600 text-base">Halo, -Nama-</div>
                        </div>
                    </section>

                    {/* Orders Section */}
                    <section className="border border-gray-400 bg-sky-200 rounded-b-lg text-base p-4 mx-8 text-gray-700">
                        <div className="flex justify-center items-center">

                            <IoLocationOutline size={30} /> Lokasi Kerja

                        </div>
                        <div className="border-t-2 border-gray-400 mt-3 pt-3 flex justify-center">
                            {/* <RealTimeClock/> */}
                        </div>
                    </section>

                    <section className="flex justify-center font-bold mt-3 ">
                        Silahkan pilih pekerjaan anda :
                    </section>
                    <section className="bg-white mx-8 grid grid-cols-2 gap-y-6 justify-around my-6">
                        {iconButtons.map((item, index) => (
                            <button key={index} className="flex flex-col items-center space-y-1">
                                <item.icon className="text-gray-500 text-5xl border-2 w-24 h-24 rounded-lg border-gray-300 p-6 bg-white transition-colors ease-in-out duration-200 active:bg-gray-300" />
                                <span className="text-base">{item.label}</span>
                            </button>
                        ))}
                    </section>

                    {/* Help Section */}
                    <section className="bg-green-100 p-4 mx-8 mb-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <FaWhatsapp className="text-gray-600" size={24} />
                            <span className="font-semibold">Butuh bantuan?</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Chat kami di WhatsApp apabila terdapat error.
                        </div>
                    </section>
                </div>
            </main>

            {/* Web sesi */}
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
                                src={'/images/charr.png'}
                            />
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
