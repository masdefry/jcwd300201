'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import ButtonCustom from "@/components/core/buttonCustom";
import { IParamsType } from "@/features/user/hooks/useSetPasswordHook/types";
import { setPasswordValidationSchema } from "@/features/worker/schemas/setPasswordValidationSchema";
import { useSetPasswordWorkerHook } from "@/features/worker/hooks/useSetPasswordWorkerHook";

export default function Page({ params }: { params: Promise<IParamsType> }) {
    const { passwordVisible,
        confirmPasswordVisible,
        isDisabledSucces,
        toggleConfirmPasswordVisibility,
        togglePasswordVisibility,
        handleSetPassword,
        isPending } = useSetPasswordWorkerHook(params)

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
                <div className="w-full h-full flex flex-col"></div>
                <div className="flex flex-col absolute inset-0 h-full px-10 items-center justify-center w-full">
                    <div className="pb-5 z-20 w-full flex flex-col justify-start">
                        <h1 className="font-bold text-neutral-800 text-3xl md:text-4xl">Selamat Datang Kembali</h1>
                        <p className="text-neutral-500 mt-2 md:text-lg">Masukkan password Anda untuk melanjutkan.</p>
                    </div>
                    <Formik
                        initialValues={{ password: '', confirmPassword: '' }}
                        validationSchema={setPasswordValidationSchema}
                        onSubmit={(values, { resetForm }) => handleSetPassword({ password: values?.password },
                            { onSuccess: () => resetForm() })}>
                        {({ setFieldValue, values }) => (
                            <Form className="flex flex-col justify-center items-center w-full space-y-4">
                                <div id="password-input" className="relative w-full">
                                    <div className="flex gap-2 lg:gap-5 items-center">
                                        <label className="text-sm lg:text-base">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500 text-xs lg:text-sm mt-1"
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
                                    <div className="flex gap-2 lg:gap-5 items-center">
                                        <label className="text-sm lg:text-base">
                                            Konfirmasi Password <span className="text-red-500">*</span>
                                        </label>
                                        <ErrorMessage
                                            name="confirmPassword"
                                            component="div"
                                            className="text-red-500 text-xs lg:text-sm mt-1"
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
                                <ButtonCustom disabled={isPending || isDisabledSucces || !values?.confirmPassword || !values?.password} type="submit" btnColor="bg-blue-600 hover:bg-blue-500" width="w-full">
                                    {isPending ? 'Memproses..' : 'Ubah Password'}
                                </ButtonCustom>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </main>
    )
}