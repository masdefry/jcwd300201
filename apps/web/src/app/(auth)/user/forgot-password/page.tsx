'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { instance } from "@/utils/axiosInstance";
import * as Yup from "yup";
import ButtonCustom from "@/components/core/button";
import { toast } from "@/components/hooks/use-toast";

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
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
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
                    initialValues={{ email: '' }}
                    validationSchema={Yup.object({ email: Yup.string().required('Email harap diisi!') })}
                    onSubmit={(values) => handleResendEmail({ email: values?.email })}
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
            </div>
        </main>
    );
}