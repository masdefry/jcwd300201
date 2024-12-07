'use client'

import ButtonCustom from "@/components/core/button";
import { Field, Form, Formik } from "formik";

export default function Page() {
    return (
        <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
            <section className="w-full flex p-4 rounded-xl h-full bg-white">
                <div className="flex flex-col w-full gap-5">
                    <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                        <h1 className="font-bold text-white">Tambah Pekerja Baru</h1>
                    </div>
                    <Formik
                        initialValues={{
                            email: '',
                            firstName: '',
                            lastName: '',
                            phoneNumber: '',
                            workerRole: '',
                            identityNumber: '',
                            storesId: '',
                            motorcycleType: '',
                            plateNumber: ''
                        }}
                        onSubmit={(values) => {
                            console.log(values)
                        }}>
                        <Form>
                            <div className="w-full h-fit space-y-6">
                                <div className="flex w-full gap-2">
                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="email" className="font-semibold">Email <span className="text-red-600">*</span></label>
                                        <Field type='email' name='email' placeholder='Masukan email anda' className='w-full py-2 text-sm px-3 focus:outline-none border' />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="phoneNumber" className="font-semibold">Nomor Telepon <span className="text-red-600">*</span></label>
                                        <Field type='text' name='phoneNumber' placeholder='Masukan nomor telepon anda' className='w-full py-2 text-sm px-3 focus:outline-none border' />
                                    </div>
                                </div>
                                <div className="flex w-full gap-2">
                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="firstName" className="font-semibold">Nama Depan <span className="text-red-600">*</span></label>
                                        <Field type='text' name='firstName' placeholder='Masukan nama depan anda' className='w-full py-2 text-sm px-3 focus:outline-none border' />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="lastName" className="font-semibold">Nama Belakang <span className="text-red-600">*</span></label>
                                        <Field type='text' name='lastName' placeholder='Masukan nama belakang anda' className='w-full py-2 text-sm px-3 focus:outline-none border' />
                                    </div>
                                </div>
                                <div className="flex w-full gap-2">
                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="identityNumber" className="font-semibold">Nomor identitas <span className="text-red-600">*</span></label>
                                        <Field type='text' name='identityNumber' placeholder='Masukan nomor identitas anda' className='w-full py-2 text-sm px-3 focus:outline-none border' />
                                    </div>

                                    {/* ganti jadi select option */}
                                    <div className="w-full flex flex-col gap-2">
                                        <label htmlFor="workerRole" className="font-semibold">Tipe pekerja <span className="text-red-600">*</span></label>
                                        <Field type='text' name='workerRole' placeholder='Masukan tipe pekerja anda' className='w-full py-2 text-sm px-3 focus:outline-none border' />
                                    </div>
                                </div>
                                <div className="flex w-full gap-2">
                                    <ButtonCustom rounded="rounded-2xl w-1/3" btnColor="bg-orange-500 disabled:bg-neutral-400">Kembali</ButtonCustom>
                                    <ButtonCustom rounded="rounded-2xl w-full" btnColor="bg-orange-500 disabled:bg-neutral-400">Buat akun</ButtonCustom>
                                </div>
                            </div>
                        </Form>
                    </Formik>
                </div>
            </section>
        </main>
    );
}