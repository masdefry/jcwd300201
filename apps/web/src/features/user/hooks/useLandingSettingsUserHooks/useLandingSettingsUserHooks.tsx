'use client'

import { FaUser, FaStore, FaHome, FaQuestionCircle, FaShieldAlt, FaInfoCircle, FaConciergeBell, FaPhoneAlt } from 'react-icons/fa';
import { FaFileContract } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authoStore";
import Cookies from 'js-cookie'
import { toast } from "@/components/hooks/use-toast";
import { useState } from "react";

const useLandingSettingsUserHooks = () => {
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
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })

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

    return {
        email,
        token,
        resetAuth,
        isDisabledSucces,
        handleLogoutAdmin,
        isPending,
        settingsItems
    }
}

export default useLandingSettingsUserHooks