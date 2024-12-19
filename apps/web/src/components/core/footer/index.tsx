'use client'
import { IoHomeSharp, IoSearchSharp } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import Link from "next/link";
import { FaGear, FaPhone, FaVoicemail } from "react-icons/fa6";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaAddressCard } from "react-icons/fa";
export default function Footer() {
  const pathname = usePathname()
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const dataPath = [
    { icon: <IoHomeSharp size={30} />, label: "Beranda", path: '/admin/dashboard' },
    { icon: <GrNotes size={30} />, label: "Pesanan", path: '/admin/order' },
    { icon: <IoSearchSharp size={30} />, label: "Laporan", path: '/admin/report' },
    { icon: <FaGear size={30} />, label: "Pengaturan", path: '/admin/settings' },
  ]

  return (
    <>
      <main className="w-full h-fit">
        <section className="fixed border-t-4 bottom-0 bg-white text-gray-800 p-3 md:hidden flex justify-around max-w-[765px] w-full md:max-w-full md:w-full items-center">
          {dataPath?.map((item, index) => (
            <Link href={item?.path} key={index}>
              <div onClick={() => handleClick(index)} className="flex flex-col items-center gap-1 cursor-pointer">
                <div className={`relative w-12 h-12 rounded-lg transition-all duration-500 ease-in-out flex justify-center items-center ${pathname?.split('/')[2] === item?.path?.split('/')[2] ? 'bg-blue-300' : 'bg-transparent'}`}>
                  <span className={`text-${pathname?.split('/')[2] === item?.path?.split('/')[2] ? 'black' : 'gray-400'}`}>
                    {item.icon}
                  </span>
                </div>
                <span className={`text-xs ${pathname?.split('/')[2] === item?.path?.split('/')[2] ? 'text-black' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </section>
      </main>

      <footer className={`w-full bottom-0 h-96 z-20 hidden bg-orange-100 md:flex flex-col ${pathname == '/worker/login' || pathname == '/user/login'
        || pathname?.split('/')[2] === 'set-password' || pathname == '/user/register' || pathname.startsWith('/admin') || pathname.startsWith('/worker') || pathname.startsWith('/user/resend-email') 
        || pathname.startsWith('/user/dashboard') ? 'md:hidden' : ''}`}>
        <div className="w-full h-full px-20">
          <div className="flex w-full h-full justify-center items-center">
            <div className="grid grid-cols-4 w-full">
              <div className="space-y-2">
                <div className="flex gap-4 items-center">
                  <div className="w-fit h-16">
                    <Link href='/'>
                      <Image
                        src="/images/logo.png"
                        alt='logo'
                        width={150}
                        height={150}
                        className="w-fit h-16"
                      />
                    </Link>
                  </div>
                  <h1 className="text-blue-400 font-bold text-lg">Clean&<span className="text-orange-400">Click</span></h1>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-700 pb-5">Tentang Kami</h1>
                <ul className="space-y-2 text-neutral-500 font-sans font-semibold">
                  <li><a href="/home" className="hover:underline">Beranda</a></li>
                  <li><a href="/about" className="hover:underline">Tentang Kami</a></li>
                  <li><a href="/services" className="hover:underline">Layanan</a></li>
                  <li><a href="/contact" className="hover:underline">Kontak</a></li>
                </ul>
              </div>

              <div>
                <h1 className="text-lg font-bold text-neutral-700 pb-5">Link Lainnya</h1>
                <ul className="space-y-2 text-neutral-500 font-sans font-semibold">
                  <li><a href="/terms" className="hover:underline">Syarat dan Ketentuan</a></li>
                  <li><a href="/faq" className="hover:underline">FAQ</a></li>
                  <li><a href="/privacy-policy" className="hover:underline">Kebijakan Privasi</a></li>
                  <li><a href="/help" className="hover:underline">Bantuan</a></li>
                </ul>
              </div>

              <div>
                <h1 className="text-lg font-bold text-neutral-700 pb-5">Kontak</h1>
                <ul className="space-y-2 text-neutral-500 font-sans font-semibold">
                  <li className="flex gap-2 items-center"><FaPhone /> +62 123-4567-890</li>
                  <li className="flex gap-2 items-center"><FaVoicemail /> info@cleannclick.com</li>
                  <li className="flex gap-2 items-center"><FaAddressCard /> Jl. Sudirman No. 1, Jakarta</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-20 px-5 border-t flex justify-center bottom-0 items-center">
          <h1 className="text-neutral-500 font-sans font-semibold">&copy; 2024. Clean&Click. All right reserved</h1>
        </div>
      </footer>
    </>
  );
};
