'use client'

import Image from "next/image";
import ButtonCustom from "../button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBurger, FaSpaghettiMonsterFlying, FaUserGear } from "react-icons/fa6";
import { useState } from "react";
import authStore from "@/zustand/authstore";
import { instance } from "@/utils/axiosInstance";
import Cookies from 'js-cookie'
import { toast } from "@/components/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { FaTimes } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import MenuCustom from "../menu";

export default function Header() {
  const token = authStore((state) => state?.token)
  const email = authStore((state) => state?.email)
  const nameUser = authStore((state) => state?.firstName)
  const profilePicture = authStore((state) => state?.profilePicture)
  const resetAuth = authStore((state) => state?.resetAuth)
  const role = authStore((state) => state?.role)
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
  const [showSideBarMenu, setShowSideBarMenu] = useState<boolean>(false)
  const pathname = usePathname()

  const handleOpenNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  const handleOpenMenuUser = () => {
    setShowSideBarMenu(!showSideBarMenu)
  }

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      return await instance.post('/user/logout', { email }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    },
    onSuccess: (res) => {
      Cookies.remove('__rolx')
      Cookies.remove('__toksed')
      resetAuth()

      toast({
        description: res?.data?.message,
        className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
      })

      setIsDisabledSucces(true)
      if (res?.data?.data?.role == 'CUSTOMER') {
        window.location.href = '/'
      } else {
        window.location.href = '/admin/login'
      }
      console.log(res)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  return (
    <nav className={`w-full h-fit fixed z-20 ${pathname == '/admin/login' || pathname == '/user/login' || pathname == '/user/register' || pathname.startsWith('/admin') ? 'hidden' : ''}`}>
      <div className="w-full h-fit bg-white border-b flex items-center px-10 py-3 z-50 relative">
        <div className="w-full flex justify-start">
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
        </div>

        {/* web */}
        <div className="w-full hidden lg:flex justify-center">
          <div className="hidden md:flex space-x-8 text-neutral-500 font-bold">
            <Link href='/' className={`hover:border-b hover:text-neutral-600 cursor-pointer ${pathname == '/' ? 'font-bold border-b text-neutral-600' : ''}`}>Home</Link>
            <Link href='/about' className={`hover:border-b hover:text-neutral-600 cursor-pointer ${pathname == '/about' ? 'font-bold border-b text-neutral-600' : ''}`}>About</Link>
            <Link href='/' className={`hover:border-b hover:text-neutral-600 cursor-pointer ${pathname == '/services' ? 'font-bold border-b text-neutral-600' : ''}`}>Services</Link>
            <Link href='/' className={`hover:border-b hover:text-neutral-600 cursor-pointer ${pathname == '/contact' ? 'font-bold border-b text-neutral-600' : ''}`}>Contact</Link>
          </div>
        </div>
        {!!token ? (
          <div className="w-full hidden lg:flex justify-end space-x-4">
            <span onClick={handleOpenMenuUser} className="w-10 h-10 cursor-pointer rounded-full">
              <Image
                title={`Hello, ${nameUser}`}
                width={400}
                height={400}
                className="w-10 h-10 object-cover rounded-full"
                alt='profile'
                src={profilePicture ? profilePicture : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'}
              />
            </span>
          </div>
        ) : (
          <div className="w-full hidden lg:flex justify-end space-x-4">
            <Link href='/user/login'>
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">Gabung Sekarang</ButtonCustom>
            </Link>
          </div>
        )}

        {showSideBarMenu &&
          <aside onMouseLeave={handleOpenMenuUser} className="w-4/12 text-neutral-400 animate-fade-left overflow-hidden absolute right-0 top-0 h-screen bg-white pt-8 px-6 transition-all duration-300 ease-in-out transform translate-x-0 shadow-lg z-40">
            <div className="w-full h-fit">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2 items-center">
                  <Image
                    title={`Hello, ${nameUser}`}
                    width={400}
                    height={400}
                    className="w-10 h-10 object-cover rounded-full"
                    alt='profile'
                    src={profilePicture ? profilePicture : 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'}
                  />
                  <h1 className="text-neutral-400 text-xl font-semibold">Hello, {nameUser && nameUser?.length > 8 ? nameUser?.slice(0, 8) : nameUser}!</h1>
                </div>
                <button onClick={handleOpenMenuUser} className="text-neutral-400 text-2xl">
                  <FaTimes />
                </button>
              </div>
              <p className="text-xs pb-5">Accounts</p>
              <div className="flex flex-col gap-5">
                <MenuCustom navigation="Profile"><FaUserGear /></MenuCustom>
                <MenuCustom navigation="Settings"><BsGearFill /></MenuCustom>
                <ButtonCustom disabled={isPending || isDisabledSucces} width="w-full" onClick={handleLogout} btnColor="bg-orange-500 hover:bg-orange-400">Logout</ButtonCustom>
              </div>
            </div>
            <div className="w-full h-1/2 z-20">
              <div className="w-full flex items-end py-4 justify-center h-full">
                <p>&copy; 2024. All Right Reserved.</p>
              </div>
            </div>
          </aside>}


        {/* mobile */}
        <div className='w-full flex lg:hidden justify-end'>
          <span onClick={handleOpenNav}>
            <FaBurger />
          </span>
        </div>
      </div>



      {
        isNavOpen ?
          <div className="w-full h-44 bg-purple-900 z-30">

          </div>
          : ''
      }

    </nav >
  )
}