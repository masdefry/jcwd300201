'use client'
import { IoHomeSharp, IoAddCircleSharp, IoSearchSharp, IoPersonAddSharp, IoPersonSharp } from "react-icons/io5";
import { GrNotes } from "react-icons/gr";
import Link from "next/link";
import { FaGear } from "react-icons/fa6";

import { useState } from "react";
import { usePathname } from "next/navigation";
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
  );
};
