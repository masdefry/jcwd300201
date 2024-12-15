'use client'

import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import Cookies from 'js-cookie'
import { FaCartArrowDown, FaDashcube, FaMoneyBillWave, FaSignOutAlt, FaUserCheck } from "react-icons/fa";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { RiProfileFill } from "react-icons/ri";
import { toast } from "@/components/hooks/use-toast";
import ButtonCustom from "@/components/core/button";
import { ConfirmAlert } from "@/components/core/confirmAlert";

const profilePict: string | undefined = process.env.NEXT_PUBLIC_PHOTO_PROFILE as string
export default function Layout({ children }: { children: ReactNode }) {
    const [isClose, setIsClose] = useState<boolean>(false)
    const profilePicture = authStore((state) => state?.profilePicture)
    const role = authStore((state) => state?.role)
    const name = authStore((state) => state?.firstName)
    const email = authStore((state) => state?.email)
    const token = authStore((state) => state?.token)
    const resetAuth = authStore((state) => state?.resetAuth)
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const router = useRouter()
    const pathname = usePathname()
    const handleCloseSideBar = () => {
        setIsClose(!isClose)
    }

    const dashboardMenuUrl: any = {
        OUTLET_ADMIN: '/worker/admin-outlet/dashboard',
        WASHING_WORKER: '/worker/washing-worker/dashboard',
        IRONING_WORKER: '/worker/ironing-worker/dashboard',
        PACKING_WORKER: '/worker/packing-worker/dashboard',
        DRIVER: '/worker/driver/dashboard',
    }

    const dashboardUrl = dashboardMenuUrl[role] || ''

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
        <main className="w-full h-fit md:h-screen md:flex flex-none">
            <section className={`w-3/12 h-full hidden md:flex bg-white ${isClose ? 'md:hidden' : 'animate-fade-right md:flex'} flex-col px-2 text-white`}>
                <div className="h-fit py-10 gap-5 flex justify-start px-5 items-center w-full">
                    <div className="w-12 h-12 rounded-full">
                        <Image
                            src={profilePicture?.includes('https://') ? profilePicture : `http://localhost:5000/api/src/public/images/${profilePicture}` || profilePict}
                            width={600}
                            height={600}
                            alt="user-profile"
                            className="w-12 h-12 object-cover rounded-full border-[1px] border-white"
                        />
                    </div>
                    <div className="flex flex-col text-base text-neutral-700">
                        <h1 className="font-bold">{name?.length > 10 ? name?.slice(0, 10) : name || 'Admin'}</h1>
                        <h1 className="italic text-[11px]">{role || 'SUPER_ADMIN'}</h1>
                    </div>
                </div>
                <h1 className="px-4 text-sm text-neutral-600 py-2">Menu</h1>
                <div className="w-full h-fit pb-3 flex flex-col gap-4">
                    <Link href={dashboardUrl} className={`w-full flex 
                        ${Object.values(dashboardMenuUrl).includes(pathname) ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaDashcube /> Dashboard</Link>
                    <Link href='/worker/driver/delivery-request' className={`w-full flex ${pathname.startsWith('/worker/driver/delivery-request') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaCartArrowDown /> Delivery Request</Link>
                    <Link href='/worker/driver/pickup-request' className={`w-full flex ${pathname.startsWith('/worker/driver/pickup-request') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaMoneyBillWave /> Pickup Request</Link>
                </div>
                <h1 className="px-4 text-sm text-neutral-600 py-2">Account</h1>
                <div className="w-full h-full flex flex-col gap-4">
                    <Link href='/worker/driver/settings' className={`w-full flex ${pathname == '/worker/driver/settings' ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaUserCheck /> Pengaturan</Link>
                    <ConfirmAlert caption="logout" onClick={() => handleLogoutAdmin()} disabled={isPending || isDisabledSucces}>
                        <span className={`w-full cursor-pointer flex items-center gap-2 hover:text-white text-neutral-700 hover:bg-orange-500 py-2 rounded-full px-4`}>
                            <FaSignOutAlt /> Logout</span>
                    </ConfirmAlert>
                </div>
            </section>
            <section className="w-full h-fit md:h-screen md:bg-white md:px-1 md:py-1 relative">
                <span onClick={handleCloseSideBar} className="absolute cursor-pointer hover:shadow-xl top-14 left-14 z-20 text-white">
                    {isClose ? <GoSidebarCollapse /> : <GoSidebarExpand />}
                </span>
                {children}
            </section>
        </main>
    );
}