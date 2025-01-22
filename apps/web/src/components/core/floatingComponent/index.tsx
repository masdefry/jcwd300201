'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaMessage } from "react-icons/fa6";

export default function FloatingMessageCustomer() {
    const [showText, setShowText] = useState<boolean>(false)
    const handleShowText = () => setShowText(!showText)
    const pathname = usePathname()

    return (
        <div className={`
            ${pathname == '/worker/login' || pathname == '/user/login'
                || pathname?.split('/')[2] === 'set-password' || pathname == '/user/register' || pathname.startsWith('/worker') || pathname.startsWith('/user/resend-email')
                || pathname.startsWith('/user/dashboard') ? 'md:hidden' : ''}
                group fixed bottom-5 right-10 p-4 hidden md:flex items-end justify-end w-auto h-auto
        `}>
            <Link onMouseEnter={handleShowText} onMouseLeave={handleShowText} href='/admin/contact' className={`text-white shadow-lg flex gap-3 items-center justify-center ${showText ? 'px-5' : 'px-4'} py-4 rounded-full bg-blue-700 bg-opacity-55 z-50 transition-all duration-300 hover:bg-blue-700 hover:scale-105`}>
                {showText ? <span className="hidden sm:block animate-fade-left">Pesan Pelanggan</span> : ''}
                <FaMessage className="text-4xl" />
            </Link>
        </div>
    );
}