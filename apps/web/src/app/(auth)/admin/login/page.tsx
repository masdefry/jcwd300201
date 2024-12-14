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

const secret_key_crypto = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || ''
export default function LoginUser() {
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
            return await instance.post('/admin/login', { email, password })
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
        <main
            className="h-screen w-screen flex justify-center items-center"
            style={{
                backgroundImage: "url('https://images.template.net/110814/animated-water-background-ns1so.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="w-full flex justify-center items-center">
                    <Image
                        src="/images/logo.png"
                        alt='logo'
                        width={150}
                        height={150}
                        className="flex justify-center"
                        priority
                    />
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
                    <Form className="flex flex-col justify-center items-center w-full space-y-4">

                        {/* Email Input */}
                        <div id="emailAdmin-input" className="w-full">
                            <div className="flex gap-5 items-center">
                                <label className="text-sm lg:text-base">
                                    Email<span className="text-red-500">*</span>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm pr-10"
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

                <div className="flex flex-col gap-2 py-3">
                    <div className="flex w-full justify-end items-center">
                        <Link
                            href={'/user/forgot-password'}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Lupa kata sandi?
                        </Link>
                    </div>
                </div>
            </div>
        </main >
    );
}