'use client'

import ButtonCustom from "@/components/core/button";
import ContentWebLayout from "@/components/core/webSessionContent";
import { useCreateWorkerHooks } from "@/features/superAdmin/hooks/useCreateWorkerHooks";
import { createUserValidation } from "@/features/superAdmin/schemas/createUserValidation";
import { ErrorMessage, Field, Form, Formik } from "formik";

export default function Page() {
    const { getDataStore, handleCreateUser, isPending } = useCreateWorkerHooks()

    return (
        <>

            {/* web */}
            <ContentWebLayout caption="Tambah Data Pekerja">
                <div className="w-full h-fit pb-10">
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
                            plateNumber: '',
                            shiftId: ''
                        }}
                        validationSchema={createUserValidation}
                        onSubmit={(values, { resetForm }) => {
                            handleCreateUser({
                                email: values?.email,
                                firstName: values?.firstName,
                                lastName: values?.lastName,
                                phoneNumber: values?.phoneNumber,
                                workerRole: values?.workerRole,
                                identityNumber: values?.identityNumber,
                                storeId: values?.storeId,
                                motorcycleType: values?.motorcycleType,
                                plateNumber: values?.plateNumber,
                                shiftId: values?.shiftId
                            }, { onSuccess: () => resetForm() })
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
                                            <label htmlFor="shiftId" className="font-semibold">Jam Kerja <span className="text-red-600">*</span></label>
                                            <Field as='select' name='shiftId' id='shiftId' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500'>
                                                <option value="" disabled>Pilih opsi</option>
                                                <option value='1'>Shift Pagi</option>
                                                <option value='2'>Shift Sore</option>
                                            </Field>
                                            <ErrorMessage component='div' name="shiftId" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex w-full gap-2">
                                        <div className="w-full flex flex-col gap-2 relative">
                                            <label htmlFor="identityNumber" className="font-semibold">Nomor identitas <span className="text-red-600">*</span></label>
                                            <Field type='text' name='identityNumber' placeholder='Masukan nomor identitas anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                            <ErrorMessage component='div' name="identityNumber" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
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
                                            </div>
                                            <div className="w-full flex flex-col gap-2 relative">
                                                <label htmlFor="plateNumber" className="font-semibold">Nomor Plat <span className="text-red-600">*</span></label>
                                                <Field type='text' name='plateNumber' placeholder='Masukan nomor plat anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                            </div>
                                        </div> : ''}
                                    <div className="flex w-full gap-2">
                                        <ButtonCustom type="submit" disabled={isPending} rounded="rounded-2xl w-full" btnColor="bg-orange-500">Buat akun</ButtonCustom>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </ContentWebLayout>
        </>
    );
}