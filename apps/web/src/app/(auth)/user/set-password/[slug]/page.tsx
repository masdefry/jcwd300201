'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import ButtonCustom from "@/components/core/button";
import { useSetPasswordHooks } from "@/features/user/hooks/useSetPasswordHooks";
import { IParamsType } from "@/features/user/hooks/useSetPasswordHooks/types";
import { setPasswordValidation } from "@/features/user/schemas/setPasswordValidation";

export default function Page({ params }: { params: Promise<IParamsType> }) {
    const { passwordVisible,
        confirmPasswordVisible,
        isDisabledSucces,
        toggleConfirmPasswordVisibility,
        togglePasswordVisibility,
        handleSetPassword,
        isPending } = useSetPasswordHooks(params)

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
                    initialValues={{ password: '', confirmPassword: '' }}
                    validationSchema={setPasswordValidation}
                    onSubmit={(values, { resetForm }) => handleSetPassword({ password: values?.password },
                        { onSuccess: () => resetForm() })}>
                    <Form className="flex flex-col justify-center items-center w-full space-y-4">
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
                            <span className="absolute right-3 transform -translate-y-7 flex items-center cursor-pointer text-gray-500"
                                onClick={togglePasswordVisibility}>
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
                            <span className="absolute right-3 transform -translate-y-7 flex items-center cursor-pointer text-gray-500"
                                onClick={toggleConfirmPasswordVisibility}>
                                {confirmPasswordVisible ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>
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