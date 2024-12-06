'use client'

import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import { IRegisterUser } from "./types";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import ButtonCustom from "@/components/core/button";

export default function RegisterUser() {
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const { toast } = useToast()

    const { mutate: handleRegister, isPending } = useMutation({
        mutationFn: async ({ email, password, firstName, lastName, phoneNumber }: IRegisterUser) => {
            return await instance.post('/user/register', {
                email, password, firstName, lastName, phoneNumber
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })
            setIsDisabledSucces(true)
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
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [confirmationPasswordVisible, setConfirmationPasswordVisible] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const togglePasswordConfirmationVisibility = () => {
        setConfirmationPasswordVisible(!confirmationPasswordVisible);
    };

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
                        password: '',
                        confirmPassword: '',
                        phoneNumber: '',
                    }}

                    validationSchema={Yup.object({
                        email: Yup.string().required('Email harap diisi!'),
                        firstName: Yup.string().required('Nama harap diisi!'),
                        lastName: Yup.string().required("Nama harap diisi!"),
                        password: Yup.string().min(8,
                            'Password minimal 8 huruf'
                        ).required('Password harap diisi!'),
                        confirmPassword: Yup.string()
                            .oneOf([Yup.ref('password'), ''], 'Password tidak sama'),
                    })}

                    onSubmit={(values) => {
                        handleRegister({
                            email: values.email,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            password: values.password,
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
                        <div className="flex gap-4 w-full">
                            <div id="password-input" className="relative w-1/2">
                                <div className="flex gap-5 items-center">
                                    <label>
                                        Password <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <Field
                                    name="password"
                                    className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
                                    placeholder="******"
                                    type={passwordVisible ? 'text' : 'password'}
                                />
                                <span
                                    className="absolute  right-3 transform -translate-y-7 flex items-center cursor-pointer text-gray-500"
                                    onClick={togglePasswordVisibility}
                                >
                                    {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                                </span>
                                <div className="h-2">
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            </div>
                            <div id="confirmPassword-input" className="relative w-1/2">
                                <div className="flex gap-5 items-center">
                                    <label>
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <Field
                                    name="confirmPassword"
                                    className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-yellow-400 text-sm pr-10"
                                    placeholder="******"
                                    type={confirmationPasswordVisible ? 'text' : 'password'}
                                />
                                <span
                                    className="absolute  right-3 transform -translate-y-7 flex items-center cursor-pointer text-gray-500"
                                    onClick={togglePasswordConfirmationVisibility}
                                >
                                    {confirmationPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                                </span>
                                <div className="h-2">
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-500 text-xs mt-1"
                                    />
                                </div>
                            </div>
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
                        {/* <button disabled={isPending || isDisabledSucces} type="submit" className="z-50 disabled:bg-neutral-400 text-yellow-300 w-full text-lg rounded-lg font-bold py-2 mb-6 bg-blue-500 hover:bg-blue-600 transition-all duration-300 ">
                            Daftar
                        </button> */}
                    </Form>
                </Formik>
            </section>

        </main>
    )
}