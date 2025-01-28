'use client'

import authStore from "@/zustand/authoStore";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { FaCartArrowDown, FaDashcube, FaMoneyBillWave, FaUserCheck } from "react-icons/fa";
import { RiProfileFill } from "react-icons/ri";
import { MdFeedback, MdWorkHistory } from "react-icons/md";
import FloatingMessageCustomer from "@/components/core/floatingComponent";
import { FaStore } from "react-icons/fa6";

const profilePict: string | undefined = process.env.NEXT_PUBLIC_PHOTO_PROFILE as string

export default function Layout({ children }: { children: ReactNode }) {
    const [isClose, setIsClose] = useState<boolean>(false)
    const profilePicture = authStore((state) => state?.profilePicture)
    const role = authStore((state) => state?.role)
    const name = authStore((state) => state?.firstName)
    const pathname = usePathname()
    const handleCloseSideBar = () => {
        setIsClose(!isClose)
    }

    return (
        <main className="w-full h-fit md:h-screen md:flex flex-none">
            <section className={`w-3/12 h-full hidden md:flex bg-white ${isClose ? 'md:hidden' : 'animate-fade-right md:flex'} flex-col px-2 text-white`}>
                <div className="h-fit py-10 gap-5 flex justify-start px-5 items-center w-full">
                    <div className="w-12 h-12 rounded-full">
                        <Image
                            src={profilePicture?.includes('https://') ? profilePicture : profilePicture?.startsWith('images-') ? `http://localhost:5000/api/src/public/images/${profilePicture}` : profilePict}
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
                <h1 className="px-4 text-sm text-neutral-600 py-3">Menu</h1>
                <div className="w-full h-full flex flex-col gap-2">
                    <Link href='/admin/dashboard' className={`w-full flex ${pathname == '/admin/dashboard' ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaDashcube /> Dashboard</Link>
                    <Link href='/admin/product' className={`w-full flex ${pathname.startsWith('/admin/product') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaCartArrowDown /> Daftar Produk</Link>
                    <Link href='/admin/order' className={`w-full flex ${pathname.startsWith('/admin/order') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaMoneyBillWave /> Daftar Pesanan</Link>
                    <Link href='/admin/worker' className={`w-full flex ${pathname.startsWith('/admin/worker') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <MdWorkHistory /> Data Pekerja</Link>
                    <Link href='/admin/outlet' className={`w-full flex ${pathname.startsWith('/admin/outlet') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaStore /> Data Outlet</Link>
                </div>
                <h1 className="px-4 text-sm text-neutral-600 py-3">Account</h1>
                <div className="w-full h-full flex flex-col gap-2">
                    <Link href='/admin/settings/account' className={`w-full flex ${pathname.startsWith('/admin/settings/account') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <RiProfileFill /> Kelola Profil</Link>
                    <Link href='/admin/contact' className={`w-full flex ${pathname.startsWith('/admin/contact') ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <MdFeedback /> Umpan balik</Link>
                    <Link href='/admin/settings' className={`w-full flex ${pathname.startsWith('/admin/settings') && pathname !== '/admin/settings/account' ? 'bg-orange-500 text-white' : 'hover:text-white text-neutral-700 hover:bg-orange-500'} items-center gap-2 py-2 rounded-full px-4`}>
                        <FaUserCheck /> Pengaturan</Link>
                </div>
            </section>
            <section className="w-full h-fit md:h-screen md:bg-white md:px-1 md:py-1 relative">
                <span onClick={handleCloseSideBar} className="absolute cursor-pointer hover:shadow-xl top-14 left-14 z-20 text-white">
                    {isClose ? <GoSidebarCollapse /> : <GoSidebarExpand />}
                </span>
                {children}
                <FloatingMessageCustomer />
            </section>
        </main>
    );
}