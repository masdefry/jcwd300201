'use client'

import ButtonCustom from "@/components/core/button";
import { RiShutDownLine } from "react-icons/ri";
import HeaderMobile from "@/components/core/headerMobile";
import { FaUser, FaStore, FaClock, FaCut, FaTags, FaTruck, FaCashRegister, FaUsers, FaReceipt, FaHome, FaClipboardList, FaChartBar, FaCog } from 'react-icons/fa';
import authStore from "@/zustand/authstore";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import Cookies from 'js-cookie'
import { toast } from "@/components/hooks/use-toast";
import { useState } from "react";
import Image from "next/image";
import { FaIdCard, FaVoicemail } from "react-icons/fa6";
import ListCustom from "@/components/core/listSettings";
import { ConfirmAlert } from "@/components/core/confirmAlert";

const profilePict: string | undefined = process.env.NEXT_PUBLIC_PHOTO_PROFILE as string
export default function Page() {
    const token = authStore((state) => state?.token)
    const email = authStore((state) => state?.email)
    const name = authStore((state) => state?.firstName)
    const profilePicture = authStore((state) => state?.profilePicture)
    const resetAuth = authStore((state) => state?.resetAuth)
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const [isLogoutSuccess, setIsLogoutSuccess] = useState<boolean>(false)

    const settingsItems = [
        { name: 'Pengaturan Akun', description: 'Ubah password akun anda', icon: FaUser },
        { name: 'Pengaturan Outlet', description: 'Tambah, ubah, hapus outlet laundry', icon: FaStore },
        { name: 'Pengaturan Layanan', description: 'Tambah, ubah, hapus layanan', icon: FaCut },
        { name: 'Pengaturan Antar-Jemput', description: 'Tambah, ubah, hapus antar-jemput', icon: FaTruck },
        { name: 'Pengaturan Kasir', description: 'Atur, tambah, ubah, hapus kasir', icon: FaCashRegister },
        { name: 'Pengaturan Pelanggan', description: 'Tambah, ubah, hapus pelanggan', icon: FaUsers },
        { name: 'Pengaturan Nota', description: 'Atur tampilan nota', icon: FaReceipt },
    ];

    const { mutate: handleLogoutAdmin, isPending } = useMutation({
        mutationFn: async () => {
                return await instance.post('/admin/logout', { email }, { headers: { Authorization: `Bearer ${token}` } })
        },
        onSuccess: (res) => {
            if (res) {
                Cookies.remove('__rolx')
                Cookies.remove('__toksed')
                resetAuth()

                toast({
                    description: res?.data?.message,
                    className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
                })

                setIsDisabledSucces(true)

                window.location.href = '/admin/login'
                console.log(res)
            }
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            console.log(err)
        }
    })

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit max-w-[425px] md:max-w-full md:w-full block md:hidden">
                    <HeaderMobile />
                    <main className="mx-8">
                        <section className="bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                            PENGATURAN
                        </section>
                        <div className="py-28 space-y-4">
                            {settingsItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center bg-white p-4 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                                >
                                    <div className="flex-shrink-0 p-3 bg-orange-400 rounded-lg">
                                        <item.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="font-medium text-gray-900">{item.name}</h2>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-center w-full ">
                                <ButtonCustom rounded="rounded-lg" btnColor="bg-red-500"><RiShutDownLine />
                                    <span className="ml-2">Keluar Akun</span></ButtonCustom>
                            </div>
                        </div>
                    </main>
                </section>
            </main>

            {/* Web sesi */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex flex-col p-4 rounded-xl h-full bg-white">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Pengaturan</h1>
                        </div>
                        {settingsItems?.map((set, i) => (
                            <ListCustom key={i} url='/' caption={set.name}><set.icon /></ListCustom>
                        ))}
                    </div>
                    <div className="w-full py-3">
                        <ConfirmAlert caption="logout" onClick={() => handleLogoutAdmin()} disabled={isPending || isDisabledSucces}>
                            <ButtonCustom rounded="rounded-2xl w-full" btnColor="bg-orange-500 disabled:bg-neutral-400" disabled={isPending || isDisabledSucces}>Logout</ButtonCustom>
                        </ConfirmAlert>
                    </div>
                </section>
                <section className="w-1/2 rounded-xl h-full flex flex-col gap-2">
                    <div className='w-full h-full bg-white rounded-xl flex flex-col gap-2'>
                        <div className="w-full h-fit py-3 bg-orange-500 rounded-t-xl px-4">
                            <h1 className="font-bold text-base text-white flex items-center gap-3"><FaUser /> Pengaturan Akun</h1>
                        </div>
                        <div className="w-full h-full bg-white rounded-xl flex flex-col gap-2 px-2 pt-3">
                            <div className="w-full flex px-3 items-center gap-4">
                                <div className="w-12 h-12 rounded-full">
                                    <Image
                                    src={profilePicture?.includes('https://') ? profilePicture : `http://localhost:5000/api/src/public/images/${profilePicture}` || profilePict}
                                        width={600}
                                        height={600}
                                        alt="user-profile"
                                        className="w-12 h-12 object-cover rounded-full border-[1px] border-white"
                                    />
                                </div>
                                <div className="text-black flex flex-col">
                                    <h1 className="font-semibold">{name && name?.length > 9 ? name?.slice(0, 9) : name || 'Admin'}</h1>
                                    <h1 className="italic text-[9px] text-neutral-500">{email || 'admin@cnc.com'}</h1>
                                </div>
                            </div>
                            <ListCustom caption={name || 'Admin'} url="/" border='border-none'><FaIdCard /></ListCustom>
                            <ListCustom caption={email || 'admin@cnc.com'} url="/" border='border-none'><FaVoicemail /></ListCustom>
                            <ButtonCustom rounded="rounded-2xl w-full" btnColor="bg-white" txtColor="text-neutral-700 border" py="py-1">Edit</ButtonCustom>
                        </div>
                    </div>
                    <div className='w-full h-full bg-white rounded-xl'>
                        <div className="w-full h-fit py-3 bg-orange-500 rounded-t-xl px-4">
                            <h1 className="font-bold text-base text-white flex items-center gap-3"><FaStore /> Pengaturan Outlet</h1>
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}