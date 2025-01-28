'use client'

import React from 'react';
import ContentWebLayout from "@/components/core/webSessionContent";
import NotaCaptionContent from "@/features/adminOutlet/components/notaCaptionContent";
import { useCreateNotaOrderHook } from "@/features/adminOutlet/hooks/useCreateNotaOrderHook";
import NotaHeader from "@/components/core/createNotaHeaders";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import FormikAdminOutletWeb from "@/features/adminOutlet/components/formikWebAdminOutlet";
import FormikAdminOutletMobile from "@/features/adminOutlet/components/formikMobileAdminOutlet";

type Iitem = {
    id: number,
    itemName: string,
    laundryItemId: number;
    quantity: number;
    weight: number;
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const {
        email, isCheckedItem, setIsCheckedItem, isDisabledSucces, handleCreateNotaOrder, createNotaPending,
        dataOrderNote, isFetching, dataItemName } = useCreateNotaOrderHook({ params })

    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>

    return (
        <>
            <MobileSessionLayout title='Buat Nota Order'>
                <NotaHeader email={email} />
                <FormikAdminOutletMobile
                    dataItemName={dataItemName}
                    dataOrderNote={dataOrderNote}
                    isDisabledSucces={isDisabledSucces}
                    setIsCheckedItem={setIsCheckedItem}
                    isCheckedItem={isCheckedItem}
                    handleCreateNotaOrder={handleCreateNotaOrder}
                    email={email}
                    createNotaPending={createNotaPending}

                />
            </MobileSessionLayout>

            <ContentWebLayout caption='Buat Nota Order'>
                <div className="pb-10 min-h-full h-fit w-full">
                    <NotaHeader email={email} />
                    <NotaCaptionContent />
                    <FormikAdminOutletWeb
                        dataItemName={dataItemName}
                        dataOrderNote={dataOrderNote}
                        isDisabledSucces={isDisabledSucces}
                        setIsCheckedItem={setIsCheckedItem}
                        isCheckedItem={isCheckedItem}
                        handleCreateNotaOrder={handleCreateNotaOrder}
                        email={email}
                        createNotaPending={createNotaPending}

                    />
                </div>
            </ContentWebLayout>
        </>
    );
}