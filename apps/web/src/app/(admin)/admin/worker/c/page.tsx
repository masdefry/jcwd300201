'use client'

import ButtonCustom from "@/components/core/button";
import { toast } from "@/components/hooks/use-toast";
import { createUserValidation } from "@/features/superAdmin/schemas/createUserValidation";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";

interface ICreateUserBody {
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    workerRole: string,
    identityNumber: string,
    storeId: string,
    motorcycleType: string,
    plateNumber: string
}

export default function Page() {
    const token = authStore((state) => state?.token)
    const { data: getDataStore } = useQuery({
        queryKey: ['get-data-store'],
        queryFn: async () => {
            const res = await instance.get('/store')

            return res?.data?.data
        }
    })

    const { mutate: handleCreateUser, isPending } = useMutation({
        mutationFn: async ({ email, firstName, lastName, phoneNumber, workerRole, identityNumber, storeId, motorcycleType, plateNumber
        }: ICreateUserBody) => {
            return await instance.post('/auth/worker/register', { email, firstName, lastName, phoneNumber, workerRole, identityNumber, storeId, motorcycleType, plateNumber }, {
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

            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            console.log(err)
        }
    })

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
                            storeId: '',
                            motorcycleType: '',
                            plateNumber: ''
                        }}
                        validationSchema={createUserValidation}
                        onSubmit={(values) => {
                            handleCreateUser({
                                email: values?.email,
                                firstName: values?.firstName,
                                lastName: values?.lastName,
                                phoneNumber: values?.phoneNumber,
                                workerRole: values?.workerRole,
                                identityNumber: values?.identityNumber,
                                storeId: values?.storeId,
                                motorcycleType: values?.motorcycleType,
                                plateNumber: values?.plateNumber
                            })
                            console.log(values)
                        }}>
                        {({ setFieldValue, values }) => (
                            <Form>
                                <div className="w-full h-fit space-y-6">
                                    <div className="flex w-full gap-2">
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="email" className="font-semibold">Email <span className="text-red-600">*</span></label>
                                            <Field type='email' name='email' placeholder='Masukan email anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                            <ErrorMessage component='div' name="email" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="phoneNumber" className="font-semibold">Nomor Telepon <span className="text-red-600">*</span></label>
                                            <Field type='text' name='phoneNumber' placeholder='Masukan nomor telepon anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                            <ErrorMessage component='div' name="phoneNumber" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex w-full gap-2">
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="firstName" className="font-semibold">Nama Depan <span className="text-red-600">*</span></label>
                                            <Field type='text' name='firstName' placeholder='Masukan nama depan anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                            <ErrorMessage component='div' name="firstName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="lastName" className="font-semibold">Nama Belakang <span className="text-red-600">*</span></label>
                                            <Field type='text' name='lastName' placeholder='Masukan nama belakang anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                            <ErrorMessage component='div' name="lastName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex w-full gap-2">
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="identityNumber" className="font-semibold">Nomor identitas <span className="text-red-600">*</span></label>
                                            <Field type='text' name='identityNumber' placeholder='Masukan nomor identitas anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                            <ErrorMessage component='div' name="identityNumber" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="storeId" className="font-semibold">Penempatan <span className="text-red-600">*</span></label>
                                            <Field as='select' name='storeId' id='storeId' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500'>
                                                <option value="" disabled>Pilih opsi</option>
                                                {getDataStore?.map((store: { storeId: string, storeName: string }, i: number) => (
                                                    <option value={store?.storeId} key={i}>{store?.storeName}</option>
                                                ))}
                                            </Field>
                                            <ErrorMessage component='div' name="storeId" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="workerRole" className="font-semibold">Tipe pekerja <span className="text-red-600">*</span></label>
                                            <Field as='select' name='workerRole' id='workerRole' onChange={(e: any) => setFieldValue('workerRole', e.target.value)} className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500'>
                                                <option value="" disabled>Pilih opsi</option>
                                                <option value="OUTLET_ADMIN">Admin Outlet</option>
                                                <option value="WASHING_WORKER">Petugas Cuci</option>
                                                <option value="IRONING_WORKER">Petugas Setrika</option>
                                                <option value="PACKING_WORKER">Petugas Packing</option>
                                                <option value="DRIVER">Petugas Pengiriman</option>
                                            </Field>
                                            <ErrorMessage component='div' name="workerRole" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                    </div>
                                    {values?.workerRole == 'DRIVER' ?
                                        <div className="flex w-full gap-2">
                                            <div className="w-full flex flex-col gap-2 relative">
                                                <label htmlFor="motorcycleType" className="font-semibold">Jenis Motor <span className="text-red-600">*</span></label>
                                                <Field type='text' name='motorcycleType' placeholder='Masukan nama motor anda anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                                {/* <ErrorMessage component='div' name="motorcycleType" className="bg-white text-red-600 absolute right-2 top-1 text-sm" /> */}
                                            </div>
                                            <div className="w-full flex flex-col gap-2 relative">
                                                <label htmlFor="plateNumber" className="font-semibold">Nomor Plat <span className="text-red-600">*</span></label>
                                                <Field type='text' name='plateNumber' placeholder='Masukan nomor plat anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                                {/* <ErrorMessage component='div' name="plateNumber" className="bg-white text-red-600 absolute right-2 top-1 text-sm" /> */}
                                            </div>
                                        </div> : ''}
                                    <div className="flex w-full gap-2">
                                        <ButtonCustom type="submit" disabled={isPending} rounded="rounded-2xl w-full" btnColor="bg-orange-500">Buat akun</ButtonCustom>
                                        {/* <ButtonCustom type="button" disabled={isPending} rounded="rounded-2xl w-1/3" btnColor="bg-orange-500">Kembali</ButtonCustom> */}
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </section>
        </main>
    );
}