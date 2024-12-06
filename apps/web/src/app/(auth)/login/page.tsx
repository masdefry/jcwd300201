'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { instance } from "@/utils/axiosInstance";
import { ILoginUser } from "./type";

export default function LoginUser() {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const { mutate: handleLoginUser } = useMutation({
        mutationFn: async ({ email, password }: ILoginUser) => {
            return await instance.post('/user/login', {
                email, password
            })
        },
        onSuccess: (res) => {
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
                        <button
                            type="submit"
                            className="text-yellow-300 disabled:text-neutral-800 disabled:bg-neutral-300 w-full rounded-lg font-bold py-2 text-sm bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                        >
                            Login
                        </button>

                        {/* Checkbox and Forgot Password Link */}
                        <div className="flex w-full justify-between items-center">
                            <div className="flex items-center">
                                <input type="checkbox" name="checkbox" id="checkbox" />
                                <h1 className="pl-3 text-sm md:text-base">Ingat saya</h1>
                            </div>
                            <Link
                                href={'/event-organizer/forgot-password'}
                                className="text-sm md:text-base text-blue-500 hover:underline"
                            >
                                Lupa kata sandi?
                            </Link>
                        </div>
                    </Form>
                </Formik>
            </div>
        </main >
    );
}