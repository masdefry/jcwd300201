'use client'

import { IoAddCircleSharp, IoSearchSharp, IoPersonSharp } from "react-icons/io5";
import { GrUserWorker } from "react-icons/gr";
import { FaWhatsapp, FaStore } from "react-icons/fa";
import { MdDashboard, MdOutlineStickyNote2 } from "react-icons/md";
import Image from "next/image";
import authStore from "@/zustand/authstore";
import { useEffect, useState } from "react";
import ChartComponents from "@/components/core/chart";
import { FaFirstOrderAlt } from "react-icons/fa6";

const iconButtons = [
    { icon: FaStore, label: "Data Outlet" },
    { icon: IoSearchSharp, label: "Cari Pesanan" },
    { icon: IoPersonSharp, label: "Data Pelanggan" },
    { icon: GrUserWorker, label: "Data Pekerja" },
];

export default function Page() {
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
                        <Image src={'/images/New Project.webp'} alt="header"
                            height={500} width={500} />
                    </section>

                    {/* Location Section */}
                    <section className="border border-gray-400 rounded-t-lg p-4 mt-4 mx-8">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-gray-600">CnC Jakarta</div>
                            <button className="text-sm flex items-center border rounded-lg border-gray-400 p-2 gap-1">
                                Tambah Lokasi <IoAddCircleSharp />
                            </button>
                        </div>
                    </section>

                    {/* Orders Section */}
                    <section className="border border-gray-400 bg-sky-200 rounded-b-lg text-sm p-4 mx-8 text-gray-700">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                                <MdOutlineStickyNote2 size={20} /> Pesanan Hari Ini
                            </div>
                            <div className="font-semibold text-right">
                                <div>Rp0</div>
                                <div>0 pesanan</div>
                            </div>
                        </div>
                        <div className="border-t-2 border-gray-400 mt-4 pt-4 flex">
                            <div className="flex-1 text-center text-lg font-bold">
                                0 <span className="text-sm">kg</span>
                            </div>
                            <div className="flex-1 text-center text-lg font-bold">
                                0 <span className="text-sm">pcs</span>
                            </div>
                        </div>
                    </section>

                    {/* Icon Buttons Section */}
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
                    <div className="w-full rounded-xl h-full space-y-2">
                        <div className="flex flex-col w-full h-full gap-2">
                            <div className="flex w-full h-full gap-2">
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg relative">
                                    <div className="absolute top-[30%] opacity-60 flex items-center gap-2">
                                        <MdDashboard className="text-6xl" />
                                        <div className="flex items-center gap-3">
                                            <h1 className="font-bold text-3xl text-center">{totalWorker ? totalWorker : '0'}</h1>
                                            <p className="font-bold text-2xl">Pekerja</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg relative">
                                    <div className="absolute top-[30%] left-2 opacity-60 flex items-center gap-2">
                                        <FaFirstOrderAlt className="text-6xl" />
                                        <div className="flex items-center gap-3">
                                            <h1 className="font-bold text-3xl text-center">{totalWorker ? totalWorker : '0'}</h1>
                                            <p className="font-bold text-2xl">Order</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex w-full h-full gap-2 bg-white rounded-xl">

                            </div>
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
