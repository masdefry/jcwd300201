'use client'

import Image from "next/image";
import ButtonCustom from "../button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBurger } from "react-icons/fa6";
import { useState } from "react";
import authStore from "@/zustand/authstore";
import { instance } from "@/utils/axiosInstance";
import Cookies from 'js-cookie'
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

export default function Header() {
  const token = authStore((state) => state?.token)
  const email = authStore((state) => state?.email)
  const resetAuth = authStore((state) => state?.resetAuth)
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
  const pathname = usePathname()

  const handleOpenNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      return await instance.post('/user/logout', {
        email: 'pybijily@cyclelove.cc' // ganti jan lupa
      }, {
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
        className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
      })

      setIsDisabledSucces(true)
      window.location.href = '/'
      console.log(res)
    },
    onError: (err) => {
      console.log(err)
    }
  })

  return (
    <nav className={`w-full h-fit fixed z-20 ${pathname == '/user/login' || pathname == '/user/register' ? 'md:hidden' : 'md:block hidden'}`}>
      <div className="w-full h-fit bg-white border-b flex items-center px-10 py-3">
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
          <div className="hidden md:flex space-x-8 text-black">
            <Link href='/' className={`hover:border-b hover:text-neutral-700 cursor-pointer ${pathname == '/' ? 'font-bold border-b' : ''}`}>Home</Link>
            <Link href='/' className={`hover:border-b hover:text-neutral-700 cursor-pointer ${pathname == '/about' ? 'font-bold border-b' : ''}`}>About</Link>
            <Link href='/' className={`hover:border-b hover:text-neutral-700 cursor-pointer ${pathname == '/services' ? 'font-bold border-b' : ''}`}>Services</Link>
            <Link href='/' className={`hover:border-b hover:text-neutral-700 cursor-pointer ${pathname == '/contact' ? 'font-bold border-b' : ''}`}>Contact</Link>
          </div>
        </div>
        {!token ? (
          <div className="w-full hidden lg:flex justify-end space-x-4">
            <Link href='/user/login'>
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">Sign Up</ButtonCustom>
            </Link>
            <Link href='/user/login'>
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">Sign In</ButtonCustom>
            </Link>
          </div>
        ) : (
          <div className="w-full hidden lg:flex justify-end space-x-4">
            <ButtonCustom disabled={isPending || isDisabledSucces} onClick={handleLogout} btnColor="bg-orange-500 hover:bg-orange-400">Logout</ButtonCustom>
          </div>
        )}


        {/* mobile */}
        <div className='w-full flex lg:hidden justify-end'>
          <span onClick={handleOpenNav}>
            <FaBurger />
          </span>
        </div>
      </div>
      {isNavOpen ?
        <div className="w-full h-44 bg-purple-900 z-30">

        </div>
        : ''}

    </nav >
  )
}