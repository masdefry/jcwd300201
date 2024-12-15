'use client'

import authStore from "@/zustand/authstore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaArrowLeft, FaArrowRight, FaCartArrowDown, FaDashcube, FaHouseDamage, FaIceCream, FaMoneyBillWave, FaSignOutAlt, FaUserCheck } from "react-icons/fa";
import { RiProfileFill } from "react-icons/ri";

const profilePict: string | undefined = process.env.NEXT_PUBLIC_PHOTO_PROFILE as string

export default function Layout({ children }: { children: ReactNode }) {
    const [isClose, setIsClose] = useState<boolean>(false)
    const profilePicture = authStore((state) => state?.profilePicture)
    const role = authStore((state) => state?.role)
    const name = authStore((state) => state?.firstName)
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
                <div className="w-full h-full flex flex-col gap-4">
                    <Link href={dashboardUrl} className={`w-full flex 
                        ${Object.values(dashboardMenuUrl).includes(pathname) ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaDashcube /> Dashboard</Link>
                    <Link href={role == 'OUTLET_ADMIN' ?  '/worker/admin-outlet/nota-order' : '/'} className={`w-full flex ${pathname == '/admin/features' ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaCartArrowDown /> {role == 'OUTLET_ADMIN' ? 'Nota Order' : role === 'DRIVER' ? 'Delivery Request' : 'Menu Order'}</Link>
                    <Link href='/admin/worker' className={`w-full flex ${pathname.startsWith('/admin/worker') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaMoneyBillWave />  {role == 'OUTLET_ADMIN' ? 'History Order' : role === 'DRIVER' ? 'Pickup Request' : 'Menu Order'}</Link>
                    <Link href='/' className={`w-full ${pathname.startsWith('/worker/driver') ? 'hidden' : 'flex'} ${pathname == '/admin/category' ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaHouseDamage /> {role == 'OUTLET_ADMIN' ? 'Resolve Order' : 'Menu Order'}</Link>
                </div>
                <h1 className="px-4 text-sm text-neutral-600 py-2">Account</h1>
                <div className="w-full h-full flex flex-col gap-4">
                    <Link href='/admin/settings' className={`w-full flex ${pathname == '/admin/settings' ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaUserCheck /> Pengaturan</Link>
                    <span className={`w-full  cursor-pointer flex items-center gap-2 hover:text-white text-neutral-700 hover:bg-orange-500 py-2 rounded-full px-4`}>
                        <RiProfileFill /> Profile</span>
                </div>
            </section>
            <section className="w-full h-fit md:h-screen md:bg-white md:px-1 md:py-1 relative">
                <span onClick={handleCloseSideBar} className="absolute cursor-pointer hover:shadow-xl top-14 left-14 z-20 text-white">
                    {isClose ? <FaArrowRight /> : <FaArrowLeft />}
                </span>
                {children}
            </section>
        </main>
    );
}