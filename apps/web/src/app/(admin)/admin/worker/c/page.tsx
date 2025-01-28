'use client'

import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import ContentWebLayout from "@/components/core/webSessionContent";
import { useCreateWorkerHook } from "@/features/superAdmin/hooks/useCreateWorkerHook";
import 'react-phone-number-input/style.css'
import FormikCreateWorkerMobile from "@/features/superAdmin/components/formikMobileCreateWorker";
import FormikCreateWorkerWeb from "@/features/superAdmin/components/formikWebCreateWorker";

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