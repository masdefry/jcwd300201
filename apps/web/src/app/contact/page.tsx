'use client'
import ButtonCustom from "@/components/core/button";
import { toast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { createMessageValidation } from "@/features/contact/schemas/createMessageValidation";

export default function Page() {
    const token = authStore((state) => state?.token)
    const [isDisabledSuccess, setIsDisabledSuccess] = useState<boolean>(false)
    const router = useRouter()
    const { mutate: handleSendMessage, isPending: isPendingSendMessage } = useMutation({
        mutationFn: async ({ name, email, textHelp, phoneNumber }: { name: string, email: string, textHelp: string, phoneNumber: string }) => {
            return await instance.post('/contact', { name, email, textHelp, phoneNumber }, {
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

            setIsDisabledSuccess(true)
            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            if (err?.response?.data?.message === 'Harap login terlebih dahulu') router.push('/user/login')
            console.log(err)
        }
    })

    return (
        <main className="w-full flex pt-[90px] bg-blue-100 h-fit py-10">

            <section className="w-full h-full px-10 py-5">
                <div className="w-full h-[500px] bg-[url('/images/pattern.png')] rounded-2xl p-8 flex flex-col justify-center"></div>
            </section>

            <section className="w-2/3 h-fit py-5 pr-10">
                <div className="w-full h-full bg-white rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Formulir Kontak</h1>
                    <Formik
                        initialValues={{
                            email: "",
                            textHelp: '',
                            phoneNumber: '',
                            name: ''
                        }}
                        validationSchema={createMessageValidation}
                        onSubmit={(values) => handleSendMessage({ name: values?.name, email: values?.email, textHelp: values?.textHelp, phoneNumber: values?.phoneNumber })}>
                        <Form className="space-y-4">
                            <div className="flex flex-col relative">
                                <label className="text-gray-700 font-semibold mb-2" htmlFor="name">Nama Lengkap</label>
                                <Field
                                    className="w-full mt-1 z-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-400 text-sm pr-10"
                                    type="text"
                                    id="name"
                                    placeholder="Masukkan nama Anda"
                                    name="name" />
                                <ErrorMessage component='div' name="name" className="text-red-500 absolute inset-0 flex w-full justify-end px-3 text-sm" />
                            </div>
                            <div className="flex flex-col relative">
                                <label className="text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                                <Field
                                    className="w-full mt-1 z-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-400 text-sm pr-10"
                                    type="email"
                                    id="email"
                                    placeholder="Masukkan email Anda"
                                    name="email" />
                                <ErrorMessage component='div' name="email" className="text-red-500 absolute inset-0 flex w-full justify-end px-3 text-sm" />
                            </div>
                            <div className="flex flex-col relative">
                                <label className="text-gray-700 font-semibold mb-2" htmlFor="email">Nomor Telepon</label>
                                <Field
                                    className="w-full mt-1 z-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-400 text-sm pr-10"
                                    type="text"
                                    id="phoneNumber"
                                    placeholder="Masukkan nomor Anda"
                                    name="phoneNumber" />
                                <ErrorMessage component='div' name="phoneNumber" className="text-red-500 absolute inset-0 flex w-full justify-end px-3 text-sm" />
                            </div>
                            <div className="flex flex-col relative">
                                <label className="text-gray-700 font-semibold mb-2" htmlFor="message">Pesan</label>
                                <Field
                                    as='textarea'
                                    name="textHelp"
                                    id="textHelp"
                                    placeholder="Tulis pesan Anda di sini"
                                    className="border z-10 border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                                />
                                <ErrorMessage component='div' name="textHelp" className="text-red-500 absolute inset-0 flex w-full justify-end px-3 text-sm" />
                            </div>
                            <ButtonCustom disabled={isPendingSendMessage || isDisabledSuccess} type="submit" width="w-full" btnColor="bg-blue-500 hover:bg-blue-500">Kirim Pesan</ButtonCustom>
                        </Form>
                    </Formik>
                </div>
            </section>
        </main>
    );
}