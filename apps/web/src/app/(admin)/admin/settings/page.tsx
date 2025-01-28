'use client'

import ButtonCustom from "@/components/core/buttonCustom";
import { FaUser, FaStore, FaCut, FaTruck, FaCashRegister, FaUsers, FaReceipt } from 'react-icons/fa';
import authStore from "@/zustand/authoStore";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import Cookies from 'js-cookie'
import { toast } from "@/components/hooks/use-toast";
import { useState } from "react";
import { FaUserCheck } from "react-icons/fa6";
import ListCustom from "@/components/core/listSettings";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
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
            }
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
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
                    <ButtonCustom rounded="rounded-2xl w-full" btnColor="bg-red-500 hover:bg-red-500" disabled={isPending || isDisabledSucces}>Logout</ButtonCustom>
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
                            <ButtonCustom rounded="rounded-2xl w-full" btnColor="bg-red-500 hover:bg-red-500" disabled={isPending || isDisabledSucces}>Logout</ButtonCustom>
                        </ConfirmAlert>
                    </div>
                </section>
            </main>
        </>
    )
}