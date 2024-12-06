'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { instance } from "@/utils/axiosInstance";
import { ILoginGoogleUser, ILoginUser } from "./type";
import * as Yup from "yup";
import authStore from "@/zustand/authstore";
import { useToast } from "@/hooks/use-toast";
import ButtonCustom from "@/components/core/button";
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { FaGoogle } from "react-icons/fa6";
import auth from "@/utils/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider()
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

    // handle login user
    const { mutate: handleLoginUser, isPending } = useMutation({
        mutationFn: async ({ email, password }: ILoginUser) => {
            return await instance.post('/user/login', {
                email, password
            })
        },

        onSuccess: (res) => {
            setToken({
                token: res?.data?.data?.token,
                firstName: res?.data?.data?.firstName,
                lastName: res?.data?.data?.lastName,
                email: res?.data?.data?.email,
                role: res?.data?.data?.role,
                isVerified: res?.data?.data?.isVerified,
                profilePicture: res?.data?.data?.profilePicture,
                isDiscountUsed: res?.data?.data?.isDiscountUsed,
            })

            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })

            const role = CryptoJS.AES.encrypt(res?.data?.data?.role, secret_key_crypto).toString()

            Cookies.set('__rolx', role)
            Cookies.set('__toksed', res?.data?.data?.token)

            /* disabled button ketika berhasil logi */
            setIsDisabledSucces(true)
            window.location.href = '/'
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

    const { mutate: signInWithGoogle } = useMutation({
        mutationFn: async ({ firstName, lastName, email, profilePicture }: ILoginGoogleUser) => {
            return await instance.post('/user/sign-w-google', {
                firstName, lastName, email, profilePicture
            })
        },
        onSuccess: (res) => {
            setToken({
                token: res?.data?.data?.token,
                firstName: res?.data?.data?.firstName,
                lastName: res?.data?.data?.lastName,
                email: res?.data?.data?.email,
                role: res?.data?.data?.role,
                isVerified: res?.data?.data?.isVerified,
                profilePicture: res?.data?.data?.profilePicture,
                isDiscountUsed: res?.data?.data?.isDiscountUsed,
            })
            
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })

            window.location.href = '/'
            console.log(res)
        },
        onError: (err) => {
            console.log(err)
        }
    })

    const { mutate: loginWithGoogle } = useMutation({
        mutationFn: async () => {
            return await signInWithPopup(auth, provider)
        },
        onSuccess: (res) => {
            signInWithGoogle({
                firstName: res?.user?.displayName?.split(' ')[0] as string,
                lastName: res?.user?.displayName?.split(' ')[1] as string,
                email: res?.user?.email as string,
                profilePicture: res?.user?.photoURL as string
            })
            console.log(res)
        },
        onError: (err) => {
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
                        email: '',
                        password: '',
                    }}
                    validationSchema={Yup.object({
                        email: Yup.string().required('Email harap diisi!'),
                        password: Yup.string().min(8,
                            'Password minimal 8 huruf'
                        ).required('Password harap diisi!')
                    })}

                    onSubmit={(values) => {
                        console.log(values);
                        handleLoginUser({ email: values.email, password: values.password })
                    }}
                >
                    <Form className="flex flex-col justify-center items-center w-full space-y-4">

                        {/* Email Input */}
                        <div id="emailOrganizer-input" className="w-full">
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
                                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
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
                    {/* login ke google */}
                    <ButtonCustom
                        onClick={loginWithGoogle}
                        disabled={isPending || isDisabledSucces}
                        type="submit"
                        btnColor="bg-black hover:bg-black"
                        width="w-full flex gap-3 items-center"
                    ><FaGoogle /> Masuk dengan Google</ButtonCustom>

                    {/* Checkbox and Forgot Password Link */}
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                            <h1 className="">Belum memiliki akun?</h1>
                            <Link href='/user/register'>Register</Link>
                        </div>
                        <Link
                            href={'/event-organizer/forgot-password'}
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