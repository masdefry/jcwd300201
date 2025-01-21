'use client'

import React from 'react';
import ContentWebLayout from "@/components/core/WebSessionContent";
import NotaHeader from "@/components/core/CreateNotaHeaders";
import InputDisplay from "@/features/adminOutlet/components/InputDisplay";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { useUserComplaintHook } from "@/features/user/hooks/useUserComplaintHook";
import FormikComplaintMobile from "@/features/user/components/FormikComplaintMobile";
import FormikComplaintWeb from "@/features/user/components/FormikComplaintWeb";


export default function Page({ params }: { params: Promise<{ slug: string }> }) {

    const { dataOrderNote, isFetching, handleComplaint, isPending } = useUserComplaintHook({ params })

    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>
    return (
        <>
            <MobileSessionLayout title='Komplain'>
                <NotaHeader />
                <div className="w-full md:w-1/2 space-y-4">
                    <h1 className="font-bold text-2xl text-gray-800 mb-4">Detail Pesanan</h1>
                    <div className="space-y-3">
                        <InputDisplay caption="Order ID" value={dataOrderNote?.order?.id || 'ORD123123'} />
                        <InputDisplay caption="Ongkos Kirim" value={`Rp${Number(dataOrderNote?.order?.deliveryFee || '0').toLocaleString("id-ID")}`} />
                        <InputDisplay caption="Biaya Laundry" value={`Rp${Number(dataOrderNote?.order?.laundryPrice || '0').toLocaleString("id-ID")}`} />
                    </div>
                </div>
                <div className="w-full md:w-1/2 space-y-4 pb-28">
                    <h1 className="font-bold text-2xl text-gray-800">Komplain</h1>
                    {!dataOrderNote?.order?.complaintText ?
                        <FormikComplaintMobile isPending={isPending} handleComplaint={handleComplaint} />
                        :
                        <>
                            <div className="border p-2 bg-gray-100 border-gray-600 w-full rounded-xl">{dataOrderNote?.order?.complaintText}</div>
                            <div>Laporan anda sudah kami proses, mohon menunggu.</div>
                            <div>Terima kasih.</div>
                        </>}
                </div>
            </MobileSessionLayout >



            <ContentWebLayout caption='Komplain'>
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
                    <div className="w-full md:w-1/2 space-y-4">
                        <h1 className="font-bold text-2xl text-gray-800">Komplain</h1>

                        {!dataOrderNote?.order?.complaintText ?
                            <FormikComplaintWeb isPending={isPending} handleComplaint={handleComplaint} />
                            :
                            <>
                                <div className="border p-2 bg-gray-100 border-gray-600 w-full rounded-xl">{dataOrderNote?.order?.complaintText}</div>
                                <div>Laporan anda sudah kami proses, mohon menunggu.</div>
                                <div>Terima kasih.</div>
                            </>}

                    </div>
                </div>
            </ContentWebLayout >
        </>
    );
}