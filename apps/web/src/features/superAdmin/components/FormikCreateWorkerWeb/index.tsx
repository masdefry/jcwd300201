import { Formik, Form, Field, ErrorMessage } from "formik";
import ButtonCustom from "@/components/core/buttonCustom";
import { IFormikCreateWorkerWeb } from "./type";
import { createUserValidationSchema } from "../../schemas/createUserValidationSchema";
import PhoneInput from 'react-phone-number-input'

export default function FormikCreateWorkerWeb({ getDataStore, isPending, handleCreateUser, setIsValuePhoneNumber, isValuePhoneNumber }: IFormikCreateWorkerWeb) {
    return (
        <Formik
            initialValues={{
                email: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                workerRole: '',
                identityNumber: '',
                outletId: '',
                motorcycleType: '',
                plateNumber: '',
                shiftId: ''
            }}
            validationSchema={createUserValidationSchema}
            onSubmit={(values, { resetForm }) => {
                handleCreateUser({
                    email: values?.email,
                    firstName: values?.firstName,
                    lastName: values?.lastName,
                    phoneNumber: values?.phoneNumber,
                    workerRole: values?.workerRole,
                    identityNumber: values?.identityNumber,
                    outletId: values?.outletId,
                    motorcycleType: values?.motorcycleType,
                    plateNumber: values?.plateNumber,
                    shiftId: values?.shiftId
                }, { onSuccess: () => resetForm() })
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
                                <PhoneInput name='phoneNumber' countryCallingCodeEditable={false} onChange={(value: any) => {
                                    setIsValuePhoneNumber(value)
                                    if (value) {
                                        setFieldValue('phoneNumber', value?.slice(1))
                                    }
                                }} international value={isValuePhoneNumber} defaultCountry="ID" className="z-20 w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500" placeholder='Masukan nomor telepon anda dengan diawali angka 8' />
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
                                <label htmlFor="outletId" className="font-semibold">Penempatan <span className="text-red-600">*</span></label>
                                <Field as='select' name='outletId' id='outletId' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500'>
                                    <option value="" disabled>Pilih opsi</option>
                                    {getDataStore?.map((store: { storeId: string, storeName: string }, i: number) => (
                                        <option value={store?.storeId} key={i}>{store?.storeName}</option>
                                    ))}
                                </Field>
                                <ErrorMessage component='div' name="outletId" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
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
                                <Field as='select' name='workerRole' id='workerRole' onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue('workerRole', e.target.value)} className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500'>
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
                            <ButtonCustom type="submit" disabled={isPending || !values?.email || !values?.firstName || !values?.identityNumber || !values?.lastName || !values?.outletId || !values?.phoneNumber || !values?.shiftId || !values?.workerRole} rounded="rounded-2xl w-full" btnColor="bg-orange-500">Buat akun</ButtonCustom>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}