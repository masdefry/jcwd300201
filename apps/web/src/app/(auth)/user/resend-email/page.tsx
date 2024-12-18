'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { instance } from "@/utils/axiosInstance";
import * as Yup from "yup";
import ButtonCustom from "@/components/core/button";
import { toast } from "@/components/hooks/use-toast";
import Link from "next/link";
import { FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa6";

export default function LoginUser() {
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)

    // handle resend email user
    const { mutate: handleResendEmail, isPending } = useMutation({
        mutationFn: async ({ email }: { email: string }) => {
            return await instance.post('/user/forgot-password', { email })
        },

        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
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
                            Atur Ulang Password Anda
                        </h1>
                        <p className="text-neutral-200 mt-4 font-sans">
                            Lupa password? Masukkan email Anda untuk menerima link pengaturan ulang password yang aman dan mudah.
                        </p>
                    </div>
                </div>
            </section>
            <section className='w-full h-full bg-white p-10 relative'>
                <div className="w-full h-full flex flex-col">
                    <div className="w-full z-20 flex items-end opacity-40 justify-end h-full gap-3">
                        <Link href='/' className="font-bold text-3xl md:text-4xl"><FaInstagram /> </Link>
                        <Link href='/' className="font-bold text-3xl md:text-4xl"><FaLinkedin /> </Link>
                        <Link href='/' className="font-bold text-3xl md:text-4xl"><FaTwitter /> </Link>
                    </div>
                </div>
                <div className="flex flex-col absolute inset-0 h-full px-10 items-center justify-center w-full">
                    <div className="pb-5 z-20 w-full flex flex-col justify-start">
                        <h1 className="font-bold text-neutral-800 text-3xl md:text-4xl">Selamat Datang Kembali</h1>
                        <p className="text-neutral-500 mt-2 md:text-lg">Masukkan email Anda untuk mendapatkan link pengaturan ulang password.</p>
                    </div>
                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={Yup.object({ email: Yup.string().required('Email harap diisi!') })}
                        onSubmit={(values) => handleResendEmail({ email: values?.email })}>
                        <Form className="flex flex-col z-20 justify-center items-center w-full space-y-4">

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

                            {/* Submit Button */}
                            <ButtonCustom
                                disabled={isPending || isDisabledSucces}
                                type="submit"
                                btnColor="bg-blue-600 hover:bg-blue-500"
                                width="w-full"
                            >Resend Email</ButtonCustom>
                        </Form>
                    </Formik>
                    <div className="flex w-full my-2 z-20 justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                            <h1 className="">Kembali ke</h1>
                            <Link href='/user/login' className="text-blue-500 hover:text-blue-700">Login</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}