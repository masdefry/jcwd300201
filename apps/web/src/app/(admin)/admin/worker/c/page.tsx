'use client'

import ButtonCustom from "@/components/core/Button";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import ContentWebLayout from "@/components/core/WebSessionContent";
import { useCreateWorkerHook } from "@/features/superAdmin/hooks/useCreateWorkerHook";
import { createUserValidationSchema } from "@/features/superAdmin/schemas/createUserValidationSchema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import FormikCreateWorkerMobile from "@/features/superAdmin/components/FormikCreateWorkerMobile";
import FormikCreateWorkerWeb from "@/features/superAdmin/components/FormikCreateWorkerWeb";

export default function Page() {
    const { getDataStore, handleCreateUser, isPending, isValuePhoneNumber, setIsValuePhoneNumber } = useCreateWorkerHook()

    return (
        <>
            <MobileSessionLayout title='Buat Data Pekerja'>
                <div className="w-full h-fit pb-28">
                    <FormikCreateWorkerMobile
                        getDataStore={getDataStore} isPending={isPending} handleCreateUser={handleCreateUser} setIsValuePhoneNumber={setIsValuePhoneNumber} isValuePhoneNumber={isValuePhoneNumber}
                    />
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Tambah Data Pekerja">
                <div className="w-full h-fit pb-10">
                    <FormikCreateWorkerWeb
                        getDataStore={getDataStore} isPending={isPending} handleCreateUser={handleCreateUser} setIsValuePhoneNumber={setIsValuePhoneNumber} isValuePhoneNumber={isValuePhoneNumber}
                    />

                </div>
            </ContentWebLayout>
        </>
    );
}