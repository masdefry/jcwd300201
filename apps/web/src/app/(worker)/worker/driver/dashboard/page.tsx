'use client'

import { FaWhatsapp, FaStore } from "react-icons/fa";
import { MdDashboard, MdOutlineStickyNote2 } from "react-icons/md";
import Image from "next/image";
import { MdOutlineIron } from "react-icons/md";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { FaFirstOrderAlt, FaMotorcycle } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import ChartComponents from "@/components/core/chart";
import authStore from "@/zustand/authstore";
import { useEffect, useState } from "react";
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"



const iconButtons = [
    { icon: BsPerson, label: "Admin Outlet" },
    { icon: CgSmartHomeWashMachine, label: "Cuci" },
    { icon: MdOutlineIron, label: "Setrika" },
    { icon: FaMotorcycle, label: "Driver" },
];

export default function Page() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const name = authStore((state) => state?.firstName)
    const totalWorker = authStore((state) => state?.totalWorker)
    const productLaundry = authStore((state) => state?.productLaundry)
    const store = authStore((state) => state?.store)
    const [isDate, setIsDate] = useState<string>('')
    const [isDay, setIsDay] = useState<number>(0)

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
    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit md:hidden block md:max-w-full max-w-[425px]">
                    <section>
                        <Image src={'/images/headerlogouser.jpg'} alt="header"
                            height={500} width={500} className="w-full" />
                    </section>

                    <section className="border border-gray-400 rounded-t-lg p-4 mt-4 mx-8">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-600">Outlet : CnC Jakarta</div>

                        </div>
                    </section>

                    <section className="border border-gray-400 bg-orange-300 rounded-b-lg text-sm p-4 mx-8 text-gray-700">
                        <div className="flex justify-between items-stretch">
                            <div className="text-left flex-1">
                                <div>Pendapatan</div>
                                <div className="font-semibold">hari ini</div>
                                <div className="text-base">Rp0</div>
                            </div>

                            <div className="w-[1px] bg-gray-400 mx-4"></div>

                            <div className="text-right flex-1">
                                <div>Pendapatan</div>
                                <div className="font-semibold">bulan ini</div>
                                <div className="text-base">Rp0</div>
                            </div>
                        </div>

                        <div className="border-t-2 border-gray-400 mt-4 pt-4 flex items-center">
                            <div className="flex-1 flex-col text-center text-lg font-bold">
                                <div className="text-sm font-normal">Pesanan (bulan ini)</div>
                                <span>0</span>
                                <span className="text-sm">order</span>
                            </div>
                            <div className="flex-1 flex-col text-center text-lg font-bold">
                                <div className="text-sm font-normal">Berat (bulan ini)</div>
                                <span>0</span>
                                <span className="text-sm">kg</span>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white mx-8 grid grid-cols-2 gap-y-6 justify-around my-6">
                        {iconButtons.map((item, index) => (
                            <button key={index} className="flex flex-col items-center space-y-1">
                                <item.icon className="text-gray-500 text-5xl border-2 w-24 h-24 rounded-lg border-gray-300 p-6 bg-white transition-colors ease-in-out duration-200 active:bg-gray-300" />
                                <span className="text-base">{item.label}</span>
                            </button>
                        ))}
                    </section>

                    <section className="bg-green-100 p-4 mx-8 mb-4 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <FaWhatsapp className="text-gray-600" size={24} />
                            <span className="font-semibold">Butuh bantuan?</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            Chat kami di WhatsApp apabila terdapat error.
                        </div>
                    </section>
                </section>
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
                                <p className="text-white">Pantau tugas harian dan status pengiriman Anda dengan mudah.</p>
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
                    <div className="w-full rounded-xl h-full gap-2 flex items-center">
                        <div className="w-1/2 h-full rounded-xl bg-white"></div>
                        <div className="w-1/2 h-full bg-white rounded-xl">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md"
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full h-1/2 bg-white rounded-xl p-5">
                    <ChartComponents />
                </section>
            </main>
        </>
    );
}
