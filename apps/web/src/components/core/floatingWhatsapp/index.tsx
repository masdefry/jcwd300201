'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";

export default function FloatingWhatsappIcon() {
    const [showText, setShowText] = useState<boolean>(false)
    const handleShowText = () => setShowText(!showText)
    const pathname = usePathname()
    const tempMessage = encodeURIComponent(`Halo, Clean&Click Laundry! Saya ingin bertanya mengenai layanan laundry yang tersedia.`)

    return (
        <div className={`
            ${pathname == '/worker/login' || pathname == '/user/login'
                || pathname?.split('/')[2] === 'set-password' || pathname == '/user/register' || pathname.startsWith('/admin') || pathname.startsWith('/worker') || pathname.startsWith('/user/resend-email')
                || pathname.startsWith('/user/dashboard') ? 'md:hidden' : ''}
                group fixed bottom-10 right-10 z-40 p-4 items-end justify-end w-auto h-auto hidden md:flex`}>
            <Link target="_blank" onMouseEnter={handleShowText} onMouseLeave={handleShowText} href={`https://wa.me/85693327635?text=${tempMessage?.trim()}`} className={`text-white shadow-lg flex gap-3 items-center justify-center ${showText ? 'px-5' : 'px-2'} py-2 rounded-full bg-green-600 z-50 bg-opacity-65 transition-all duration-300 hover:bg-green-700 hover:scale-105`}>
                {showText ? <span className="hidden sm:block animate-fade-left">Hubungi Kami</span> : ''}
                <FaWhatsapp className="text-6xl" />
            </Link>
        </div>
    );
}