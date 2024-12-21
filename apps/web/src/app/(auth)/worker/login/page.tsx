'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useToast } from "@/components/hooks/use-toast";
import ButtonCustom from "@/components/core/button";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { loginAdminValidation } from "@/features/adminLogin/schemas";
import * as Yup from 'yup'

const secret_key_crypto = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || ''
export default function Page() {
    const { toast } = useToast()
    const setToken = authStore((state) => state?.setAuth)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)

    /* handle password visible */
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const { mutate: handleLoginAdmin, isPending } = useMutation({
        mutationFn: async ({ email, password }: { email: string, password: string }) => {
            return await instance.post('/auth/worker/login', { email, password })
        },
        onSuccess: (res) => {
            setToken({
                token: res?.data?.data?.token,
                firstName: res?.data?.data?.firstName,
                lastName: res?.data?.data?.lastName,
                email: res?.data?.data?.email,
                role: res?.data?.data?.role,
                totalWorker: res?.data?.data?.totalWorker,
                productLaundry: res?.data?.data?.productLaundry
            })

            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            const role = CryptoJS.AES.encrypt(res?.data?.data?.role, secret_key_crypto).toString()

            Cookies.set('__rolx', role)
            Cookies.set('__toksed', res?.data?.data?.token)

            setIsDisabledSucces(true)
            
            if (res?.data?.data?.role == 'SUPER_ADMIN') {
                window.location.href = '/admin/dashboard'
            } else if(res?.data?.data?.role == 'OUTLET_ADMIN'){
                window.location.href = '/worker/admin-outlet/dashboard'
            } else if(res?.data?.data?.role == 'WASHING_WORKER'){
                window.location.href = '/worker/washing-worker/dashboard'
            } else if(res?.data?.data?.role == 'IRONING_WORKER'){
                window.location.href = '/worker/ironing-worker/dashboard'
            } else if(res?.data?.data?.role == 'PACKING_WORKER'){
                window.location.href = '/worker/packing-worker/dashboard'
            } else if(res?.data?.data?.role == 'DRIVER'){
                window.location.href = '/worker/driver/dashboard'
            } else {
                window.location.href = '/'
            }

            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
            console.log(err)
        }
    })

    return (

        <main className='w-full h-screen flex'>
            <section className='w-3/5 h-full py-2 pl-2'>
                <div className='bg-blue-700 rounded-2xl p-10 h-full w-full relative'>
                    <div className="flex flex-col h-full w-full">
                        <div className="w-full flex items-center">
                            <Image width={500} height={500} alt="logo" src='/images/logo-no-text.png' className="w-fit h-16 object-cover" />
                            <h1 className="font-semibold flex items-start text-orange-300">CLEAN&CLICK</h1>
                        </div>
                        <div className="h-full w-full flex items-end font-sans font-normal">
                            <p className="text-white text-sm">&copy; 2024. Clean&Click. All right reserved</p>
                        </div>
                    </div>
                    <div className="inset-0 absolute w-full flex-col h-full p-10 flex justify-center">
                        <h1 className="text-4xl text-white font-semibold font-sans">
                            Layanan Laundry Modern dan Efisien Bersama <span className='text-orange-400 font-bold'>Clean&Click</span>
                        </h1>
                        <p className="text-neutral-200 mt-4 font-sans">
                            Nikmati kemudahan mencuci pakaian tanpa ribet!
                            Clean&Click siap membantu Anda dengan layanan cepat, bersih, dan terpercaya.
                        </p>
                    </div>
                </div>
            </section>
            <section className='w-full h-full bg-white p-10 relative'>
                <div className="w-full h-full flex flex-col">
                    <div className="w-full z-20 flex items-end opacity-40 justify-end h-full gap-3"></div>
                </div>
                <div className="flex flex-col absolute inset-0 h-full px-10 items-center justify-center w-full">
                    <div className="pb-5 z-20 w-full flex flex-col justify-start">
                        <h1 className="font-bold text-neutral-800 text-3xl md:text-4xl">Selamat Datang Kembali</h1>
                        <p className="text-neutral-500 mt-2 md:text-lg">Masuk untuk mengakses akun Anda dan mengelola pesanan.</p>
                    </div>
                    <Formik
                        initialValues={{
                            email: '',
                            password: '',
                        }}
                        validationSchema={loginAdminValidation}
                        onSubmit={(values) => {
                            console.log(values);
                            handleLoginAdmin({ email: values.email, password: values.password })
                        }}
                    >
                        <Form className="flex z-20 flex-col justify-center items-center w-full space-y-4">

                            {/* Email Input */}
                            <div id="emailOrganizer-input" className="w-full">
                                <div className="flex gap-5 items-center">
                                    <label className="text-sm lg:text-base">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-red-500 text-[5px] md:text-xs lg:text-sm mt-1"
                                    />
                                </div>
                                <Field
                                    name="email"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm pr-10"
                                    placeholder="example@gmail.com"
                                    type="email"
                                />
                            </div>

                            {/* Password Input */}
                            <div id="password-input" className="relative w-full">
                                <div className="flex gap-5 items-center">
                                    <label className="text-sm lg:text-base">
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-[5px] md:text-xs lg:text-sm mt-1"
                                    />
                                </div>
                                <Field
                                    name="password"
                                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm pr-10"
                                    placeholder="******"
                                    type={passwordVisible ? 'text' : 'password'}
                                />
                                <span
                                    className="absolute right-3 transform -translate-y-7 flex items-center cursor-pointer text-gray-500"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </div>

                            {/* Submit Button */}
                            <ButtonCustom
                                disabled={isPending || isDisabledSucces}
                                type="submit"
                                btnColor="bg-blue-600 hover:bg-blue-500"
                                width="w-full"
                            >Masuk</ButtonCustom>
                        </Form>
                    </Formik>

                    <div className="flex w-full flex-col gap-2 py-3 z-20">
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-1 text-sm"></div>
                            <Link href={'/user/resend-email'}  className="text-sm text-blue-500 hover:underline">
                                Lupa kata sandi?
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}