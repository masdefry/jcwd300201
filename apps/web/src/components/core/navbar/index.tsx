'use client'

import Image from "next/image";
import ButtonCustom from "../buttonCustom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBurger, FaDashcube, FaSprayCan,  FaUserGear } from "react-icons/fa6";
import { useState } from "react";
import authStore from "@/zustand/authoStore";
import { instance } from "@/utils/axiosInstance";
import Cookies from 'js-cookie'
import { toast } from "@/components/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { FaHandHoldingWater, FaTimes, FaTshirt } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import { IoAlbumsOutline } from "react-icons/io5";
import { LuContact } from "react-icons/lu";
import { ConfirmAlert } from "../confirmAlertCustom";
import { MdArrowDropDown } from "react-icons/md";
import { FiHelpCircle } from "react-icons/fi";
import { Role } from "../roleCustom";
import MenuCustom from "../menuCustom";

const profilePict: string | undefined = process.env.NEXT_PUBLIC_PHOTO_PROFILE as string
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
  const [isService, setIsService] = useState<boolean>(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleOpenNav = () => setIsNavOpen(!isNavOpen)
  const handleOpenMenuUser = () => setShowSideBarMenu(!showSideBarMenu)

  const { mutate: handleLogout, isPending } = useMutation({
    mutationFn: async () => {
      if (role === 'CUSTOMER') {
        return await instance.post('/auth/user/logout', { email }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      } else {
        return await instance.post('/auth/worker/logout', { email }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      }
    },
    onSuccess: (res) => {
      if (res) {
        toast({
          description: res?.data?.message,
          className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
        })

        window.location.href = '/'

        Cookies.remove('__rolx')
        Cookies.remove('__toksed')
        resetAuth()

        setIsDisabledSucces(true)
      }
    },
    onError: (err) => {
      console.log('err')
    }
  })

  const dashboardMenuUrl: Record<Role, string> = {
    SUPER_ADMIN: '/admin/dashboard',
    OUTLET_ADMIN: '/worker/admin-outlet/dashboard',
    WASHING_WORKER: '/worker/washing-worker/dashboard',
    IRONING_WORKER: '/worker/ironing-worker/dashboard',
    PACKING_WORKER: '/worker/packing-worker/dashboard',
    DRIVER: '/worker/driver/dashboard',
  }

  const profilMenuUrl: Record<Role, string> = {
    SUPER_ADMIN: '/admin/settings',
    OUTLET_ADMIN: '/worker/admin-outlet/settings',
    WASHING_WORKER: '/worker/washing-worker/settings',
    IRONING_WORKER: '/worker/ironing-worker/settings',
    PACKING_WORKER: '/worker/packing-worker/settings',
    DRIVER: '/worker/driver/settings',
  }

  const settingsMenuUrl: Record<Role, string> = {
    SUPER_ADMIN: '/admin/settings',
    OUTLET_ADMIN: '/worker/admin-outlet/settings',
    WASHING_WORKER: '/worker/washing-worker/settings',
    IRONING_WORKER: '/worker/ironing-worker/settings',
    PACKING_WORKER: '/worker/packing-worker/settings',
    DRIVER: '/worker/driver/settings',
  }

  const dashboardUrl = dashboardMenuUrl[role as Role] || ''
  const profileUrl = profilMenuUrl[role as Role] || ''
  const settingsUrl = settingsMenuUrl[role as Role] || ''

  return (
    <nav className={`w-full h-fit hidden md:block md:fixed bg-white z-20 ${pathname == '/worker/login' || pathname == '/user/login'
      || pathname?.split('/')[2] === 'set-password' || pathname == '/user/register' || pathname.startsWith('/admin') || pathname.startsWith('/worker') || pathname.startsWith('/user/resend-email')
      || pathname.startsWith('/user/dashboard') ? 'md:hidden' : ''}`}>
      <div className="w-full h-fit bg-white border-b flex justify-between items-center px-10 py-3 z-50 relative">
        <div className="w-fit h-16">
          <Link href='/' className='flex gap-2 items-center'>
            <Image
              src="/images/logo-no-text.png"
              alt='logo'
              width={150}
              height={150}
              className="w-fit h-16"
            />
            <h1 className="font-bold text-xl text-orange-500">CLEAN&CLICK</h1>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-neutral-500 font-bold">
          <Link href='/' className={`hover:border-b-2 hover:border-orange-500 hover:text-neutral-600 cursor-pointer text-lg ${pathname == '/' ? 'font-bold border-b-2 border-b-orange-500 text-neutral-600' : ''}`}>Beranda</Link>
          <Link href='/about-us' className={`hover:border-b-2 hover:border-orange-500 hover:text-neutral-600 cursor-pointer text-lg ${pathname.startsWith('/about-us') ? 'font-bold border-b-2 border-b-orange-500 text-neutral-600' : ''}`}>Tentang kami</Link>
          <div className="relative z-0"
            onMouseEnter={() => setIsService(true)}
            onMouseLeave={() => setIsService(false)}>
            <button className={`hover:border-b-2 hover:border-orange-500 flex hover:text-neutral-600 cursor-pointer items-center text-lg ${isService ? 'font-bold border-b-2 border-b-orange-500 text-neutral-600' : ''}`}>Layanan <MdArrowDropDown className="text-[25px]" /></button>
            {isService && (
              <span className="w-[300px] absolute h-fit z-0 pt-3 right-0 top-6">
                <div className="border w-full h-fit pb-8 pt-4 px-4 space-y-5 bg-white rounded-b-2xl shadow-md">
                  <MenuCustom url="/service" navigation="Layanan Mencuci"><FaTshirt /></MenuCustom>
                  <MenuCustom url="/service" navigation="Layanan Setrika"><FaHandHoldingWater /></MenuCustom>
                  <MenuCustom url="/service" navigation="Mencuci dan Setrika"><FaSprayCan /></MenuCustom>
                </div>
              </span>
            )}
          </div>
          <Link href='/contact' className={`hover:border-b-2 hover:border-orange-500 hover:text-neutral-600 cursor-pointer text-lg ${pathname == '/contact' ? 'font-bold border-b-2 border-b-orange-500 text-neutral-600' : ''}`}>Kontak</Link>
          <Link href='/faq' className={`hover:border-b-2 hover:border-orange-500 hover:text-neutral-600 cursor-pointer text-lg ${pathname == '/faq' ? 'font-bold border-b-2 border-b-orange-500 text-neutral-600' : ''}`}>FAQ</Link>
          {!!token ? (
            <div className="hidden lg:flex space-x-4">
              <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400" rounded="rounded-full" onClick={() => router.push('/user/dashboard/pickup')}>Order Sekarang</ButtonCustom>
              <span onClick={handleOpenMenuUser} className="w-11 h-11 cursor-pointer rounded-full">
                <Image
                  title={`Hello, ${nameUser}`}
                  width={400}
                  height={400}
                  className="w-11 h-11 object-cover border-[1px] border-gray-200 rounded-full"
                  alt='profile'
                  src={profilePicture?.includes('https://') ? profilePicture : profilePicture?.startsWith('images-') ? `http://localhost:5000/api/src/public/images/${profilePicture}` : profilePict}
                />
              </span>
            </div>
          ) : (
            <div className="hidden lg:flex space-x-4">
              <Link href='/user/login'>
                <ButtonCustom btnColor="bg-orange-500 hover:bg-orange-400">Gabung Sekarang</ButtonCustom>
              </Link>
            </div>
          )}
        </div>
        {showSideBarMenu &&
          <aside onMouseLeave={handleOpenMenuUser} className="w-4/12 z-50 text-neutral-400 animate-fade-left overflow-hidden absolute right-0 top-0 h-screen bg-white pt-8 px-6 transition-all duration-300 ease-in-out transform translate-x-0 shadow-lg">
            <div className="w-full h-fit">
              <div className="flex justify-between items-center mb-8">
                <div className="flex gap-2 items-center">
                  <Image
                    title={`Hello, ${nameUser}`}
                    width={400}
                    height={400}
                    className="w-10 h-10 border-[1px] border-gray-200 object-cover rounded-full"
                    alt='profile'
                    src={profilePicture?.includes('https://') ? profilePicture : profilePicture?.startsWith('images-') ? `http://localhost:5000/api/src/public/images/${profilePicture}` : profilePict}
                  />
                  <h1 className="text-neutral-400 text-xl font-semibold">Hello, {nameUser && nameUser?.length > 8 ? nameUser?.slice(0, 8) : nameUser}!</h1>
                </div>
                <button onClick={handleOpenMenuUser} className="text-neutral-400 text-2xl">
                  <FaTimes />
                </button>
              </div>
              <p className="text-xs pb-5">Menu</p>
              {role === 'CUSTOMER' ?
                <>
                  <div className="flex flex-col gap-5">
                    <MenuCustom url='/user/dashboard/home' navigation="Beranda"><FaDashcube /></MenuCustom>
                    <MenuCustom url='/user/dashboard/settings' navigation="Profil"><FaUserGear /></MenuCustom>
                    <MenuCustom url='/about-us' navigation="Tentang kami"><IoAlbumsOutline /></MenuCustom>
                    <MenuCustom url='/contact' navigation="Kontak"><LuContact /></MenuCustom>
                  </div>
                  <p className="text-xs py-5">Profil</p>
                  <div className="flex flex-col gap-5">
                    <MenuCustom url='/faq' navigation="FAQ"><FiHelpCircle /></MenuCustom>
                    <MenuCustom url='/user/dashboard/settings' navigation="Settings"><BsGearFill /></MenuCustom>
                    <ConfirmAlert disabled={isPending || isDisabledSucces} caption="Apakah anda yakin ingin logout?" onClick={() => handleLogout()}>
                      <ButtonCustom disabled={isPending || isDisabledSucces} rounded="rounded-2xl w-full" btnColor="bg-orange-500">Logout</ButtonCustom>
                    </ConfirmAlert>
                  </div>
                </>
                :
                <>
                  <div className="flex flex-col gap-5">
                    <MenuCustom url={dashboardUrl} navigation="Dashboard"><FaDashcube /></MenuCustom>
                    <MenuCustom url={profileUrl} navigation="Profil"><FaUserGear /></MenuCustom>
                    <MenuCustom url='/about-us' navigation="Tentang kami"><IoAlbumsOutline /></MenuCustom>
                    <MenuCustom url='/contact' navigation="Contact"><LuContact /></MenuCustom>
                  </div>
                  <p className="text-xs py-5">Profil</p>
                  <div className="flex flex-col gap-5">
                    <MenuCustom url='/faq' navigation="FAQ"><FiHelpCircle /></MenuCustom>
                    <MenuCustom url={settingsUrl} navigation="Settings"><BsGearFill /></MenuCustom>
                    <ConfirmAlert disabled={isPending || isDisabledSucces} caption="Apakah anda yakin ingin logout?" onClick={() => handleLogout()}>
                      <ButtonCustom disabled={isPending || isDisabledSucces} rounded="rounded-2xl w-full" btnColor="bg-orange-500">Logout</ButtonCustom>
                    </ConfirmAlert>
                  </div>
                </>
              }
            </div>
          </aside>}
        <div className='w-full flex lg:hidden justify-end'>
          <span onClick={handleOpenNav}>
            <FaBurger />
          </span>
        </div>
      </div>
      {isNavOpen ? <div className="w-full h-44 bg-white z-30"> </div> : ''}
    </nav >
  )
}