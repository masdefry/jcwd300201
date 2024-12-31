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
import { FaIdCard, FaUserCheck, FaVoicemail } from "react-icons/fa6";
import ListCustom from "@/components/core/listSettings";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";

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
        { name: 'Pengaturan Akun', description: 'Ubah pengaturan akun dan perbarui kata sandi Anda.', icon: FaUser, url: '/admin/settings/account' },
        { name: 'Kelola Outlet', description: 'Tambah, ubah, atau hapus outlet laundry yang tersedia.', icon: FaStore, url: '/admin/outlet' },
        { name: 'Kelola Pesanan', description: 'Atur pesanan antar-jemput laundry, mulai dari penambahan hingga penghapusan.', icon: FaTruck, url: '/admin/order' },
        { name: 'Kelola Pekerja', description: 'Tambah, ubah, atau hapus informasi profil pekerja.', icon: FaUsers, url: '/admin/worker' },
        { name: 'Layanan Laundry', description: 'Kelola layanan laundry, termasuk penambahan, perubahan, atau penghapusan layanan.', icon: FaCut, url: '/admin/product' },
        { name: 'Umpan Balik Pelanggan', description: 'Atur dan kelola umpan balik pelanggan, serta kelola data kasir.', icon: FaCashRegister, url: '/admin/contact' },
        { name: 'Pengaturan Nota', description: 'Atur tampilan dan format nota untuk transaksi laundry.', icon: FaReceipt, url: '/admin/settings/receipt' },
    ];



    const { mutate: handleLogoutAdmin, isPending } = useMutation({
        mutationFn: async () => {
            return await instance.post('/auth/worker/logout', { email }, { headers: { Authorization: `Bearer ${token}` } })
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

                window.location.href = '/worker/login'
                console.log(res)
            }
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            console.log(err)
        }
    })

    return (
        <>
            <ContentMobileLayout title='Pengaturan' icon={<FaUserCheck className='text-lg' />}>
                <div className="min-h-44 px-3 flex gap-5 flex-col w-full">
                    {settingsItems?.map((set, i) => (
                        <Link href={set?.url} key={i} className="flex border-b pb-2 justify-between w-full h-fit items-center">
                            <div className="flex items-center gap-5 text-neutral-700">
                                <set.icon />
                                <h1 className="text-neutral-700">{set?.name}</h1>
                            </div>
                            <div className='w-2 h-2 rounded-full bg-green-700'></div>
                        </Link>
                    ))}
                </div>
                <ConfirmAlert caption="Apakah anda yakin ingin logout?" onClick={() => handleLogoutAdmin()} disabled={isPending || isDisabledSucces}>
                    <ButtonCustom rounded="rounded-2xl w-full" btnColor="bg-orange-500" disabled={isPending || isDisabledSucces}>Logout</ButtonCustom>
                </ConfirmAlert>
            </ContentMobileLayout>

            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex flex-col p-4 rounded-xl h-full bg-white">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Pengaturan</h1>
                        </div>
                        {settingsItems?.map((set, i) => (
                            <ListCustom key={i} url={set?.url} caption={set.name}><set.icon /></ListCustom>
                        ))}
                    </div>
                    <div className="w-full py-3">
                        <ConfirmAlert caption="Apakah anda yakin ingin logout?" onClick={() => handleLogoutAdmin()} disabled={isPending || isDisabledSucces}>
                            <ButtonCustom rounded="rounded-2xl w-full" btnColor="bg-orange-500" disabled={isPending || isDisabledSucces}>Logout</ButtonCustom>
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
                            <ListCustom caption={name || 'Admin'} url="/admin/settings/account" border='border-none'><FaIdCard /></ListCustom>
                            <ListCustom caption={email || 'admin@cnc.com'} url="/admin/settings/account" border='border-none'><FaVoicemail /></ListCustom>
                            <Link href='/admin/settings/account' className="w-full text-center bg-white py-1 hover:text-neutral-900 px-3 rounded-2xl text-neutral-700 border">Edit</Link>
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