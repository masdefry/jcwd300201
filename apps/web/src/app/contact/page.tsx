'use client';

import ButtonCustom from '@/components/core/button';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { createMessageValidation } from '@/features/contact/schemas/createMessageValidation';
import { useContactHooks } from '@/features/contact/hooks/useContactHooks';
import Image from 'next/image';

export default function Page() {
    const { handleSendMessage, isPendingSendMessage } = useContactHooks();

    return (
        <main className="flex w-full bg-white pt-[90px] py-10">
            <section className="flex w-full items-center px-10 py-3 gap-2">
                <div className="flex w-full flex-col justify-center pr-5">
                    <h1 className="mb-6 text-2xl font-bold text-gray-800">Formulir Kontak</h1>
                    <Formik
                        initialValues={{
                            email: '',
                            textHelp: '',
                            phoneNumber: '',
                            name: ''
                        }}
                        validationSchema={createMessageValidation}
                        onSubmit={(values, { resetForm }) => {
                            handleSendMessage(
                                {
                                    name: values.name,
                                    email: values.email,
                                    textHelp: values.textHelp,
                                    phoneNumber: values.phoneNumber
                                },
                                { onSuccess: () => resetForm() }
                            );
                        }}
                    >
                        {() => (
                            <Form className="space-y-4">
                                <div className="relative flex flex-col">
                                    <label htmlFor="name" className="mb-2 font-semibold text-gray-700">Nama Lengkap</label>
                                    <Field
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Masukkan nama Anda"
                                        className="z-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                                    />
                                    <ErrorMessage name="name" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                                </div>
                                <div className="relative flex flex-col">
                                    <label htmlFor="email" className="mb-2 font-semibold text-gray-700">Email</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Masukkan email Anda"
                                        className="z-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                                    />
                                    <ErrorMessage name="email" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                                </div>
                                <div className="relative flex flex-col">
                                    <label htmlFor="phoneNumber" className="mb-2 font-semibold text-gray-700">Nomor Telepon</label>
                                    <Field
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        type="text"
                                        placeholder="Masukkan nomor Anda"
                                        className="z-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-orange-400"
                                    />
                                    <ErrorMessage name="phoneNumber" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                                </div>
                                {/* Message Field */}
                                <div className="relative flex flex-col">
                                    <label htmlFor="textHelp" className="mb-2 font-semibold text-gray-700">Pesan</label>
                                    <Field
                                        as="textarea"
                                        id="textHelp"
                                        name="textHelp"
                                        placeholder="Tulis pesan Anda di sini"
                                        className="z-10 w-full text-sm rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-orange-500"
                                    />
                                    <ErrorMessage name="textHelp" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                                </div>
                                <ButtonCustom
                                    type="submit"
                                    disabled={isPendingSendMessage}
                                    width="w-full"
                                    btnColor="bg-blue-600 hover:bg-blue-600"
                                >
                                    Kirim Pesan
                                </ButtonCustom>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="relative h-full w-8/12 min-h-screen rounded-2xl bg-blue-700 p-10">
                    <div className="absolute inset-0 flex flex-col justify-center p-10">
                        <h1 className="text-xl font-semibold text-white md:text-2xl lg:text-4xl">Hubungi Kami</h1>
                        <p className="mt-4 text-neutral-200">
                            Apakah Anda memiliki pertanyaan, masukan, atau membutuhkan bantuan? Tim Clean&Click siap membantu Anda!
                            Jangan ragu untuk mengisi formulir kontak di sebelah kiri atau hubungi kami melalui email dan nomor telepon yang tertera.
                            Kami akan merespons Anda secepat mungkin.
                        </p>
                    </div>
                    <div className="flex h-full flex-col">
                        <div className="flex items-center">
                            <Image
                                src="/images/logo-no-text.png"
                                alt="logo"
                                width={600}
                                height={500}
                                className="h-16 w-fit object-cover"
                            />
                            <h1 className="ml-2 font-semibold text-orange-300">CLEAN&CLICK</h1>
                        </div>
                        <div className="mt-auto font-sans text-sm text-white">
                            &copy; 2024. Clean&Click. All rights reserved.
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
