'use client'

import authStore from "@/zustand/authstore";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCartArrowDown, FaDashcube, FaHouseDamage, FaIceCream, FaMoneyBillWave, FaSignOutAlt, FaUserCheck } from "react-icons/fa";

export default function Layout({ children }: { children: ReactNode }) {
    const [isClose, setIsClose] = useState<boolean>(false)
    const profilePicture = authStore((state) => state?.profilePicture)
    const router = useRouter()
    const pathname = usePathname()
    const handleCloseSideBar = () => {
        setIsClose(!isClose)
    }

    return (
        <main className="w-full h-screen flex">
            <section className={`w-3/12 h-full bg-teal-950 ${isClose ? 'hidden' : 'flex'} flex-col px-2 text-white`}>
                <div className="h-fit py-10 gap-5 flex justify-start px-5 items-center w-full">
                    <div className="w-10 h-10 rounded-full">
                        <Image
                            src={profilePicture ? profilePicture : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'}
                            width={600}
                            height={600}
                            alt="user-profile"
                            className="w-10 h-10 rounded-full border-[1px] border-white"
                        />
                    </div>
                    <div className="flex flex-col text-sm">
                        <h1>ADMIN</h1>
                        <h1>ADMIN</h1>
                    </div>
                </div>
                <h1 className="px-4 text-sm text-neutral-600 py-2">Menu</h1>
                <div className="w-full h-full flex flex-col gap-4">
                    <Link href='/admin/dashboard' className={`w-full flex ${pathname == '/admin/dashboard' ? 'bg-white text-black' : 'hover:bg-white'} items-center gap-2 hover:text-black py-2 rounded-full px-4`}>
                        <FaDashcube /> Dashboard</Link>
                    <Link href='/admin/features' className={`w-full flex ${pathname == '/dashboard/features' ? 'bg-white text-black' : 'hover:bg-white'} items-center gap-2 hover:text-black py-2 rounded-full px-4`}>
                        <FaCartArrowDown /> Features</Link>
                    <Link href='/dashboard/worker' className={`w-full flex ${pathname == '/dashboard/worker' ? 'bg-white text-black' : 'hover:bg-white'} items-center gap-2 hover:text-black py-2 rounded-full px-4`}>
                        <FaMoneyBillWave /> Worker</Link>
                    <Link href='/' className={`w-full flex ${pathname == '/dashboard/category' ? 'bg-white text-black' : 'hover:bg-white'} items-center gap-2 hover:text-black py-2 rounded-full px-4`}>
                        <FaHouseDamage /> Home Page</Link>
                </div>
                <h1 className="px-4 text-sm text-neutral-600 py-2">Account</h1>
                <div className="w-full h-full flex flex-col gap-4">
                    <Link href='/dashboard/profile' className={`w-full flex ${pathname == '/dashboard/profile' ? 'bg-white text-black' : 'hover:bg-white'} items-center gap-2 hover:text-black py-2 rounded-full px-4`}>
                        <FaUserCheck /> Profile</Link>
                    <span className={`w-full  cursor-pointer flex hover:bg-white items-center gap-2 hover:text-black py-2 rounded-full px-4`}>
                        <FaSignOutAlt /> Logout</span>
                </div>
            </section>
            <section className="w-full bg-black px-5 py-5 relative">
                <span onClick={handleCloseSideBar} className="absolute cursor-pointer top-16 left-14 z-20 text-white">
                    {isClose ? <FaArrowRight /> : <FaArrowLeft />}
                </span>
                {children}
            </section>
        </main>
    );
}