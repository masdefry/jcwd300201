'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import ButtonCustom from "@/components/core/buttonCustom";
import Link from "next/link";
import { useRegisterHook } from "@/features/user/hooks/useRegisterHook";
import { registerUserValidationSchema } from "@/features/user/schemas/registerUserValidationSchema";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export default function Page() {
    const { handleRegister, isPending, isValuePhoneNumber, setIsValuePhoneNumber } = useRegisterHook()

    return (

        <main className="w-full flex justify-center items-center h-fit">
            <section className="hidden md:block w-1/2 ">
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
            <section className="flex flex-col items-center w-full lg:w-1/2 px-10 py-5 rounded-lg lg:mx-24 border h-fit">
                <div className="flex flex-col w-full pb-5">
                    <h1 className="font-bold text-3xl">Register</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Silakan daftar untuk membuat akun baru dan menikmati layanan kami.</p>
                </div>
                <Formik
                    initialValues={{
                        email: '',
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                    }}

                    validationSchema={registerUserValidationSchema}
                    onSubmit={(values, { resetForm }) => {
                        handleRegister({
                            email: values.email,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            phoneNumber: values.phoneNumber,
                        }, {
                            onSuccess: () => {
                                resetForm()
                                setIsValuePhoneNumber('')
                            }
                        })
                    }}>
                    {({ setFieldValue, values }) => (
                        <Form className='flex flex-col justify-center items-center w-full space-y-4'>
                            <div id="firstName-input" className="w-full">
                                <div className="flex gap-5 items-center relative">
                                    <label>Nama Depan<span className="text-red-500">*</span></label>
                                    <ErrorMessage name="firstName" component="div" className="text-red-500 flex w-full justify-end text-xs absolute" />
                                </div>
                                <Field name="firstName" className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm pr-10" placeholder="John" type="text" />
                            </div>
                            <div id="lastName-input" className="w-full">
                                <div className="flex gap-5 items-center relative">
                                    <label>Nama Belakang<span className="text-red-500">*</span></label>
                                    <ErrorMessage name="lastName" component="div" className="text-red-500 flex w-full justify-end text-xs absolute" />
                                </div>
                                <Field name="lastName" className=" w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm pr-10" placeholder="Doe" type="text" />
                            </div>
                            <div id="email-input" className="w-full">
                                <div className="flex gap-5 items-center relative">
                                    <label>Email<span className="text-red-500">*</span></label>
                                    <ErrorMessage name="email" component="div" className="text-red-500 flex w-full justify-end text-xs absolute" />
                                </div>
                                <Field name="email" className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm pr-10" placeholder="example@gmail.com" type="email" />
                            </div>
                            <div id="phoneNumber-input" className="w-full">
                                <div className="flex gap-5 items-center relative">
                                    <label>Nomor Telepon <span className="text-red-500">*</span></label>
                                    <ErrorMessage name="phoneNumber" component="div" className="text-red-500 flex w-full justify-end text-xs absolute" />
                                </div>
                                <PhoneInput name='phoneNumber' countryCallingCodeEditable={false} onChange={(value: any) => {
                                    setIsValuePhoneNumber(value)
                                    if (value) {
                                        setFieldValue('phoneNumber', value?.slice(1))
                                    }
                                }} international value={isValuePhoneNumber} defaultCountry="ID" className=" w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm mt-1" placeholder='Masukan nomor telepon anda dengan diawali angka 8' />
                            </div>
                            <ButtonCustom disabled={isPending || !values?.email || !values?.firstName || !values?.lastName || !values?.phoneNumber} type="submit" btnColor="bg-blue-600 hover:bg-blue-500" width="w-full">
                                {isPending ? 'Memproses..' : 'Daftar'}
                            </ButtonCustom>
                        </Form>
                    )}
                </Formik>
                <div className="flex flex-col gap-2 w-full my-2">
                    <div className="flex w-full justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                            <h1 className="">Sudah memiliki akun?</h1>
                            <Link href='/user/login' className='text-blue-500 hover:text-blue-700 hover:underline'>Login</Link>
                        </div>
                        <Link href={'/user/resend-email'} className="text-sm text-blue-500 hover:underline">
                            Atur ulang kata sandi?
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    )
}