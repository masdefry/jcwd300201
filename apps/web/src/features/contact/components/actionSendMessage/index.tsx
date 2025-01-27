'use client'

import { ErrorMessage, Field, Form, Formik } from "formik";
import { createMessageValidation } from "../../schemas/createMessageValidation";
import { useContactHook } from "../../hooks/useContactHooks";
import PhoneInput from 'react-phone-number-input'
import ButtonCustom from "@/components/core/buttonCustom";
import 'react-phone-number-input/style.css'

export default function SendMessageComponent() {
    const { handleSendMessage, isPendingSendMessage, isValuePhoneNumber, setIsValuePhoneNumber } = useContactHook();

    return (
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
                    {
                        onSuccess: () => {
                            setIsValuePhoneNumber('')
                            resetForm()
                        }
                    }
                );
            }}>
            {({ setFieldValue, values }) => (
                <Form className="space-y-4">
                    <div className="relative flex flex-col">
                        <label htmlFor="name" className="mb-2 font-semibold text-gray-700">Nama Lengkap</label>
                        <Field id="name" name="name" type="text" placeholder="Masukkan nama Anda" className="z-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-orange-400" />
                        <ErrorMessage name="name" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                    </div>
                    <div className="relative flex flex-col">
                        <label htmlFor="email" className="mb-2 font-semibold text-gray-700">Email</label>
                        <Field id="email" name="email" type="email" placeholder="Masukkan email Anda" className="z-10 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-orange-400" />
                        <ErrorMessage name="email" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                    </div>
                    <div className="relative flex flex-col">
                        <label htmlFor="phoneNumber" className="mb-2 font-semibold text-gray-700">Nomor Telepon</label>
                        <PhoneInput name='phoneNumber' countryCallingCodeEditable={false} onChange={(value: any) => {
                            setIsValuePhoneNumber(value)
                            if (value) {
                                setFieldValue('phoneNumber', value?.slice(1))
                            }
                        }} international value={isValuePhoneNumber} defaultCountry="ID" className="z-20 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border focus:border-orange-500 text-sm mt-1" placeholder='Masukan nomor telepon anda dengan diawali angka 8' />
                        <ErrorMessage name="phoneNumber" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                    </div>
                    <div className="relative flex flex-col">
                        <label htmlFor="textHelp" className="mb-2 font-semibold text-gray-700">Pesan</label>
                        <Field as="textarea" id="textHelp" name="textHelp" placeholder="Tulis pesan Anda di sini" className="z-10 w-full text-sm rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-orange-500" />
                        <ErrorMessage name="textHelp" component="div" className="absolute inset-0 flex w-full justify-end px-3 text-sm text-red-500" />
                    </div>
                    <ButtonCustom type="submit" disabled={isPendingSendMessage || !values?.email || !values?.name || !values?.phoneNumber || !values?.textHelp} width="w-full" btnColor="bg-blue-600 hover:bg-blue-600">
                        Kirim Pesan
                    </ButtonCustom>
                </Form>
            )}
        </Formik>
    );
}