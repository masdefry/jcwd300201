'use client'

import React from 'react';
import ContentWebLayout from "@/components/core/webSessionContent";
import NotaHeader from "@/components/core/createNotaHeaders";
import InputDisplay from "@/features/adminOutlet/components/inputDisplayCustom";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { useUserPaymentHook } from "@/features/user/hooks/useUserPaymentHook";
import PaymentPopUpDialog from "@/features/user/components/paymentDialogPopUp";
import PaymentMethodMobile from '@/features/user/components/paymentMobileMethod';
import PaymentMethodWeb from '@/features/user/components/paymentMobileMethod';

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const {
        isArrCardPayment, token, isUploadDialogOpen, setIsUploadDialogOpen, isPaymentMethod, setIsPaymentMethod,
        isFetching, refetch, isPending, uploadPaymentProof, isUploading, router, email, dataOrderNote,
        dataOrderNoteLoading, handlePaymmentOrder } = useUserPaymentHook({ params })

    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>

    return (
        <>
            <MobileSessionLayout title='Pembayaran'>
                <NotaHeader />
                <div className="w-full md:w-1/2 space-y-4">
                    <h1 className="font-bold text-2xl text-gray-800 mb-4">Detail Pesanan</h1>
                    <div className="space-y-3">
                        <InputDisplay caption="Order ID" value={dataOrderNote?.order?.id || 'ORD123123'} />
                        <InputDisplay caption="Ongkos Kirim" value={`Rp${Number(dataOrderNote?.order?.deliveryFee || '0').toLocaleString("id-ID")}`} />
                        <InputDisplay caption="Biaya Laundry" value={`Rp${Number(dataOrderNote?.order?.laundryPrice || '0').toLocaleString("id-ID")}`} />
                    </div>
                </div>
                <PaymentMethodMobile
                    isArrCardPayment={isArrCardPayment} dataOrderNote={dataOrderNote} setIsPaymentMethod={setIsPaymentMethod} isPaymentMethod={isPaymentMethod} handlePaymmentOrder={handlePaymmentOrder} setIsUploadDialogOpen={setIsUploadDialogOpen} router={router}
                />
            </MobileSessionLayout>

            <PaymentPopUpDialog
                isUploadDialogOpen={isUploadDialogOpen} setIsUploadDialogOpen={setIsUploadDialogOpen} isUploading={isUploading} uploadPaymentProof={uploadPaymentProof}
            />

            <ContentWebLayout caption='Detail Pembayaran'>
                <NotaHeader />
                <div className="w-full flex gap-4 p-6">
                    <div className="w-full md:w-1/2 space-y-4">
                        <h1 className="font-bold text-2xl text-gray-800 mb-4">Detail Pesanan</h1>
                        <div className="space-y-3">
                            <InputDisplay caption="Order ID" value={dataOrderNote?.order?.id || 'ORD123123'} />
                            <InputDisplay caption="Ongkos Kirim" value={`Rp${Number(dataOrderNote?.order?.deliveryFee || '0').toLocaleString("id-ID")}`} />
                            <InputDisplay caption="Biaya Laundry" value={`Rp${Number(dataOrderNote?.order?.laundryPrice || '0').toLocaleString("id-ID")}`} />
                        </div>
                    </div>
                    <PaymentMethodWeb
                        isArrCardPayment={isArrCardPayment} dataOrderNote={dataOrderNote} setIsPaymentMethod={setIsPaymentMethod} isPaymentMethod={isPaymentMethod} handlePaymmentOrder={handlePaymmentOrder} setIsUploadDialogOpen={setIsUploadDialogOpen} router={router}
                    />
                </div>
            </ContentWebLayout >
        </>
    );
}