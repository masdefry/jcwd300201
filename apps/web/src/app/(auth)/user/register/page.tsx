'use client'

import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import { IRegisterUser } from "./types";
import { useToast } from "@/components/hooks/use-toast";
import Image from "next/image";
import ButtonCustom from "@/components/core/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterUser() {
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const router = useRouter()
    const { toast } = useToast()

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: async ({ email, firstName, lastName, phoneNumber }: IRegisterUser) => {
            return await instance.post('/user/register', { email, firstName, lastName, phoneNumber })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setIsDisabledSucces(true)
            console.log(res)

            router.push('/user/login')
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

        <main className="w-screen flex justify-center ">
            <section className="hidden lg:block w-1/2 ">
                <div className="w-full h-screen">
                    <Image
                        src='/images/register.jpg'
                        alt="resgister"
                        width={960}
                        height={1080}
                        className="w-full h-screen"
                    />
                </div>
            </section>
            <section className="flex flex-col items-center w-full lg:w-1/2 px-10 py-10 rounded-lg shadow-lg lg:mx-24 border my-10 h-full">
                <div className="flex justify-center w-full">
                    <Image
                        src='/images/logo.png'
                        alt='logo'
                        width={150}
                        height={150}
                        className="flex justify-center"
                    />
                </div>
                <Formik
                    initialValues={{
                        email: '',
                        firstName: '',
                        lastName: '',
                        confirmPassword: '',
                        phoneNumber: '',
                    }}

                    validationSchema={Yup.object({
                        email: Yup.string().required('Email harap diisi!'),
                        firstName: Yup.string().required('Nama harap diisi!'),
                        lastName: Yup.string().required("Nama harap diisi!"),
                        phoneNumber: Yup.string().required('Nomor telepon harap diisi!')
                    })}

                    onSubmit={(values) => {
                        handleRegister({
                            email: values.email,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            phoneNumber: values.phoneNumber,
                        })
                    }}
                >

                    <Form className='flex flex-col justify-center items-center w-full space-y-4'>
                        <div className="flex w-full gap-4 ">
                            <div id="firstName-input" className=" w-1/2">
                                <div className="flex gap-5 items-center">
                                    <label>
                                        Nama Depan<span className="text-red-500">*</span>
                                    </label>
                                    <ErrorMessage
                                        name="firstName"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                                <Field
                                    name="firstName"
                                    className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
                                    placeholder="John"
                                    type="text"
                                />
                            </div>
                            <div id="lastName-input" className=" w-1/2">
                                <div className="flex gap-5 items-center">
                                    <label>
                                        Nama Belakang<span className="text-red-500">*</span>
                                    </label>
                                    <ErrorMessage
                                        name="lastName"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                                <Field
                                    name="lastName"
                                    className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
                                    placeholder="Doe"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div id="email-input" className=" w-full">
                            <div className="flex gap-5 items-center">
                                <label>
                                    Email<span className="text-red-500">*</span>
                                </label>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>
                            <Field
                                name="email"
                                className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
                                placeholder="example@gmail.com"
                                type="email"
                            />
                        </div>
                        <div id="phoneNumber-input" className=" w-full">
                            <div className="flex gap-5 items-center">
                                <label>
                                    Nomor HP <span className="text-red-500">*</span>
                                </label>
                                <ErrorMessage
                                    name="phoneNumber"
                                    component="div"
                                    className="text-red-500 text-xs mt-1"
                                />
                            </div>
                            <Field
                                name="phoneNumber"
                                className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
                                placeholder="0856..."
                                type="phoneNumber"
                            />
                        </div>
                        <ButtonCustom
                            disabled={isPending || isDisabledSucces}
                            type="submit"
                            btnColor="bg-blue-600 hover:bg-blue-500"
                            width="w-full"
                        >Daftar</ButtonCustom>
                    </Form>
                </Formik>
                <div className="flex flex-col gap-2 w-full my-2">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                            <h1 className="">Sudah memiliki akun?</h1>
                            <Link href='/user/login' className='text-blue-500 hover:text-blue-700'>Login</Link>
                        </div>
                        <Link
                            href={'/user/forgot-password'}
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Lupa kata sandi?
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    )
}