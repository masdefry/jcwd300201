'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { use, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { instance } from "@/utils/axiosInstance";
import * as Yup from "yup";
import authStore from "@/zustand/authstore";
import { useToast } from "@/components/hooks/use-toast";
import ButtonCustom from "@/components/core/button";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { FaGoogle } from "react-icons/fa6";
import auth from "@/utils/firebase";
import { useRouter } from "next/navigation";

interface IParamsType {
    slug: string
}

export default function Page({ params }: { params: Promise<IParamsType> }) {
    const slug = use(params)
    const router = useRouter()
    const token = slug?.slug

    const { toast } = useToast()
    const setToken = authStore((state) => state?.setAuth)
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false)
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)

    /* handle password visible */
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible)
    }

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible)
    }

    const { mutate: handleSetPassword, isPending } = useMutation({
        mutationFn: async ({ password }: { password: string }) => {
            return await instance.post('/user/set-password', { password }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
            router.push('/user/login')
        },
        onError: (err:any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })

            console.log(err)
        }
    })

    return (
        <main className="h-screen w-screen flex justify-center items-center"
            style={{
                backgroundImage: "url('https://images.template.net/110814/animated-water-background-ns1so.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
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
                        password: '',
                        confirmPassword: ''
                    }}

                    validationSchema={Yup.object({
                        password: Yup.string().min(8, 'Password minimal 8 huruf').required('Password harap diisi!'),
                        confirmPassword: Yup.string().oneOf([Yup.ref('password'), ''], 'Password tidak sama'),
                    })}

                    onSubmit={(values) => {
                        handleSetPassword({ password: values?.password })
                        console.log(values);
                    }}
                >
                    <Form className="flex flex-col justify-center items-center w-full space-y-4">

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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
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

                        <div id="confirm-password-input" className="relative w-full">
                            <div className="flex gap-5 items-center">
                                <label className="text-sm lg:text-base">
                                    Konfirmasi Password <span className="text-red-500">*</span>
                                </label>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="text-red-500 text-[5px] md:text-xs lg:text-sm mt-1"
                                />
                            </div>
                            <Field
                                name="confirmPassword"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
                                placeholder="******"
                                type={confirmPasswordVisible ? 'text' : 'password'}
                            />
                            <span
                                className="absolute right-3 transform -translate-y-7 flex items-center cursor-pointer text-gray-500"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>

                        {/* Submit Button */}
                        <ButtonCustom
                            disabled={isPending || isDisabledSucces}
                            type="submit"
                            btnColor="bg-blue-600 hover:bg-blue-500"
                            width="w-full"
                        >Ubah Password</ButtonCustom>
                    </Form>
                </Formik>
            </div>
        </main >
    );
}