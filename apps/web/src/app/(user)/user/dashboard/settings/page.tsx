'use client'

import { FaUser, FaStore, FaHome, FaSignOutAlt, FaQuestionCircle, FaShieldAlt, FaInfoCircle, FaConciergeBell, FaPhoneAlt } from 'react-icons/fa';
import ContentWebLayout from "@/components/core/webSessionContent";
import ListCustom from "@/components/core/listSettings";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import { FaFileContract, FaGear } from "react-icons/fa6";
import Link from "next/link";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import Cookies from 'js-cookie'
import { toast } from "@/components/hooks/use-toast";
import { useState } from "react";
import ButtonCustom from '@/components/core/button';

const settingsItems = [
    { name: 'Beranda', description: 'Kembali ke beranda', icon: FaHome, url: '/' },
    { name: 'Pengaturan Akun', description: 'Ubah profil akun anda', icon: FaUser, url: '/user/dashboard/settings/account' },
    { name: 'Pengaturan Alamat', description: 'Tambah, ubah, hapus alamat rumah', icon: FaStore, url: '/user/dashboard/settings/address' },
    { name: 'Tentang Kami', description: 'Informasi tentang kami', icon: FaInfoCircle, url: '/about-us' },
    { name: 'Layanan', description: 'Informasi tentang layanan', icon: FaConciergeBell, url: '/service' },
    { name: 'Kontak', description: 'Hubungi kami', icon: FaPhoneAlt, url: '/contact' },
    { name: 'FAQ', description: 'Pertanyaan yang sering diajukan', icon: FaQuestionCircle, url: '/faq' },
    { name: 'Kebijakan Privasi', description: 'Kebijakan privasi aplikasi', icon: FaShieldAlt, url: '/privacy-policy' },
    { name: 'Syarat dan Ketentuan', description: 'Syarat dan ketentuan penggunaan', icon: FaFileContract, url: '/terms-condition' },
];

export default function Page() {
    const email = authStore((state) => state?.email)
    const token = authStore((state) => state?.token)
    const resetAuth = authStore((state) => state?.resetAuth)
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const { mutate: handleLogoutAdmin, isPending } = useMutation({
        mutationFn: async () => {
            return await instance.post('/auth/user/logout', { email }, { headers: { Authorization: `Bearer ${token}` } })
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

                window.location.href = '/user/login'
                        }
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })
    return (
        <>
            <ContentMobileLayout title='Pengaturan' icon={<FaGear className='text-lg' />}>
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
                    <ConfirmAlert caption="Apakah anda yakin ingin logout?" onClick={() => handleLogoutAdmin()} disabled={isPending || isDisabledSucces}>
                        <ButtonCustom btnColor='bg-red-500 hover:bg-red-500' type='button' rounded='rounded-full' disabled={isPending || isDisabledSucces} width='w-full gap-2'><FaSignOutAlt /> Logout</ButtonCustom>
                    </ConfirmAlert>
                </div>
            </ContentMobileLayout>
            <ContentWebLayout caption="Pengaturan">
                {settingsItems?.map((set, i) => (
                    <ListCustom key={i} url={set?.url} caption={set.name}><set.icon /></ListCustom>
                ))}
            </ContentWebLayout>
        </>
    )
}