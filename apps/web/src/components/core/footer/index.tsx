'use client'
import { IoHomeSharp } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import Link from "next/link";
import { FaGear, FaPhone, FaStore, FaTruck, FaVoicemail } from "react-icons/fa6";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaAddressCard, FaHandsHelping, FaHistory, FaInfoCircle, FaPhoneAlt } from "react-icons/fa";
import authStore from "@/zustand/authoStore";

type MenuItem = {
  icon: JSX.Element;
  label: string;
  path: string;
};

type Role = 'SUPER_ADMIN' | 'WASHING_WORKER' | 'IRONING_WORKER' | 'OUTLET_ADMIN' | 'DRIVER' | 'PACKING_WORKER' | 'CUSTOMER';

export default function Footer() {
  const role = authStore((state) => state?.role)
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pathname = usePathname()

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const defaultMenu = [
    { icon: <IoHomeSharp className="text-xl" />, label: "Beranda", path: '/' },
    { icon: <FaInfoCircle className="text-xl" />, label: "Tentang", path: '/about-us' },
    { icon: <FaHandsHelping className="text-xl" />, label: "Layanan", path: '/service' },
    { icon: <FaPhoneAlt className="text-xl" />, label: "Kontak", path: '/contact' },
  ]

  const menuByRole: Record<Role, MenuItem[]> = {
    SUPER_ADMIN: [
      { icon: <IoHomeSharp className="text-xl" />, label: "Beranda", path: '/admin/dashboard' },
      { icon: <GrNotes className="text-xl" />, label: "Pesanan", path: '/admin/order' },
      { icon: <FaStore className="text-xl" />, label: "Outlet", path: '/admin/outlet' },
      { icon: <FaGear className="text-xl" />, label: "Pengaturan", path: '/admin/settings' },
    ],
    WASHING_WORKER: [
      { icon: <IoHomeSharp className="text-xl" />, label: "Beranda", path: '/worker/washing-worker/dashboard' },
      { icon: <GrNotes className="text-xl" />, label: "Pesanan", path: '/worker/washing-worker/order' },
      { icon: <FaHistory className="text-xl" />, label: "Riwayat", path: '/worker/washing-worker/history' },
      { icon: <FaGear className="text-xl" />, label: "Pengaturan", path: '/worker/washing-worker/settings' },
    ],
    IRONING_WORKER: [
      { icon: <IoHomeSharp className="text-xl" />, label: "Beranda", path: '/worker/ironing-worker/dashboard' },
      { icon: <GrNotes className="text-xl" />, label: "Pesanan", path: '/worker/ironing-worker/order' },
      { icon: <FaHistory className="text-xl" />, label: "Laporan", path: '/worker/ironing-worker/history' },
      { icon: <FaGear className="text-xl" />, label: "Pengaturan", path: '/worker/ironing-worker/settings' },
    ],
    OUTLET_ADMIN: [
      { icon: <IoHomeSharp className="text-xl" />, label: "Beranda", path: '/worker/admin-outlet/dashboard' },
      { icon: <GrNotes className="text-xl" />, label: "Pesanan", path: '/worker/admin-outlet/order' },
      { icon: <FaHistory className="text-xl" />, label: "Laporan", path: '/worker/admin-outlet/history' },
      { icon: <FaGear className="text-xl" />, label: "Pengaturan", path: '/worker/admin-outlet/settings' },
    ],
    DRIVER: [
      { icon: <IoHomeSharp className="text-xl" />, label: "Beranda", path: '/worker/driver/dashboard' },
      { icon: <GrNotes className="text-xl" />, label: "Pesanan", path: '/worker/driver/pickup-request' },
      { icon: <FaTruck className="text-xl" />, label: "Antar", path: '/worker/driver/delivery-request' },
      { icon: <FaGear className="text-xl" />, label: "Pengaturan", path: '/worker/driver/settings' },
    ],
    PACKING_WORKER: [
      { icon: <IoHomeSharp className="text-xl" />, label: "Beranda", path: '/worker/packing-worker/dashboard' },
      { icon: <GrNotes className="text-xl" />, label: "Pesanan", path: '/worker/packing-worker/order' },
      { icon: <FaHistory className="text-xl" />, label: "Riwayat", path: '/worker/packing-worker/history' },
      { icon: <FaGear className="text-xl" />, label: "Pengaturan", path: '/worker/packing-worker/settings' },
    ],
    CUSTOMER: [
      { icon: <IoHomeSharp className="text-xl" />, label: "Dashboard", path: '/user/dashboard/home' },
      { icon: <GrNotes className="text-xl" />, label: "Pesanan", path: '/user/dashboard/order' },
      { icon: <FaTruck className="text-xl" />, label: "Pickup", path: '/user/dashboard/pickup' },
      { icon: <FaGear className="text-xl" />, label: "Pengaturan", path: '/user/dashboard/settings' },
    ]
  }
  const dataPath: MenuItem[] = menuByRole[role as Role] || []

  return (
    <>
      <main className={`w-full h-fit ${pathname == '/worker/login' ? 'hidden' : 'block'}`}>
        <section className="fixed border-t-4 bottom-0 bg-white text-gray-800 p-3 md:hidden flex justify-around max-w-[765px] w-full items-center shadow-lg">
          {dataPath?.length > 0 ? (
            dataPath.map((item: any, index: number) => (
              <Link href={item?.path} key={index} passHref>
                <div onClick={() => handleClick(index)} className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ease-in-out ${pathname === item?.path ? "text-orange-500" : "text-gray-500 hover:text-orange-400"}`}>
                  <div className={`relative w-12 h-12 rounded-lg flex justify-center items-center transition-all duration-300 ease-in-out ${pathname === item?.path ? "bg-orange-100" : "bg-gray-100 hover:bg-orange-50"}`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className={`text-xs ${pathname === item?.path ? "font-semibold" : "font-normal"}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            defaultMenu.map((item: any, index: number) => (
              <Link href={item?.path} key={index} passHref>
                <div onClick={() => handleClick(index)} className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-300 ease-in-out ${pathname === item?.path ? "text-orange-500" : "text-gray-500 hover:text-orange-400"}`}>
                  <div className={`relative w-12 h-12 rounded-lg flex justify-center items-center transition-all duration-300 ease-in-out ${pathname === item?.path ? "bg-orange-100" : "bg-gray-100 hover:bg-orange-50"}`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <span className={`text-xs ${pathname === item?.path ? "font-semibold" : "font-normal"}`}>
                    {item.label}
                  </span>
                </div>
              </Link>
            ))
          )}
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
                  <h1 className="text-orange-400 font-bold text-lg">Clean&<span className="text-orange-400">Click</span></h1>
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-neutral-700 pb-5">Tentang Kami</h1>
                <ul className="space-y-2 text-neutral-500 font-sans font-semibold">
                  <li><Link href="/" className="hover:underline">Beranda</Link></li>
                  <li><Link href="/about-us" className="hover:underline">Tentang Kami</Link></li>
                  <li><Link href="/service" className="hover:underline">Layanan</Link></li>
                  <li><Link href="/contact" className="hover:underline">Kontak</Link></li>
                </ul>
              </div>

              <div>
                <h1 className="text-lg font-bold text-neutral-700 pb-5">Link Lainnya</h1>
                <ul className="space-y-2 text-neutral-500 font-sans font-semibold">
                  <li><Link href="/terms-condition" className="hover:underline">Syarat dan Ketentuan</Link></li>
                  <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                  <li><Link href="/privacy-policy" className="hover:underline">Kebijakan Privasi</Link></li>
                  <li><Link href="/help" className="hover:underline">Bantuan</Link></li>
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
