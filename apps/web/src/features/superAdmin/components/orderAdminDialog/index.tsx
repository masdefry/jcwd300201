import { FaWhatsapp } from "react-icons/fa6";
import React from 'react';
import Link from 'next/link';
import Timeline from "@/components/core/timeline";

export default function OrderDialogAdmin({ orderData }: IOrderDialogAdmin) {
    return (
        <>
            <div className="grid gap-4 py-2 border-b border-neutral-400">
                <div className="flex justify-between gap-3 items-center">
                    <div className="w-2/3 flex flex-col">
                        <h2 className="text-sm font-semibold">{orderData?.order?.id?.length > 15 ? <span>{orderData?.order?.id.slice(0, 15)}..</span> : orderData?.order?.id}</h2>
                        <h2 className="text-sm">{orderData?.order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' :
                            orderData?.order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : 'Mencuci dan Setrika'}</h2>
                    </div>
                    <div className="w-1/3 flex flex-col items-end">
                        <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[0]} </p>
                        <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[1].slice(0, 5)} </p>
                    </div>
                </div>
            </div>

            <span className='font-semibold'>Proses Laundry:</span>
            <div className="flex flex-row justify-between pb-2">
                <div className='space-y-2'>
                    <Timeline orderStatus={orderData?.orderStatus} />
                </div>
                <div className="space-y-3">
                    <div className="border rounded-lg border-gray-700 p-2 text-sm">
                        <div className="font-semibold">Driver Pickup:</div>
                        {orderData?.orderStatus[1]?.status === "DRIVER_TO_OUTLET" ? (
                            <>
                                <Link href={`https://wa.me/${orderData?.orderStatus[1]?.Worker?.phoneNumber}`} className="text-black">
                                    <div>
                                        {`${orderData?.orderStatus[1]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[1]?.Worker?.lastName ?? ''}`}
                                    </div>
                                    <div className="flex gap-1 items-center">
                                        <FaWhatsapp color="green" />{orderData?.orderStatus[1]?.Worker?.phoneNumber ?? 'No phone number available'}
                                    </div>
                                </Link>
                            </>
                        ) : (
                            "Menunggu Driver"
                        )}
                    </div>
                    <div className="border rounded-lg border-gray-700 p-2 text-sm">
                        <div className="font-semibold">Delivery Driver:</div>
                        <div>
                            {orderData?.orderStatus[7]?.status === "DRIVER_TO_CUSTOMER" ? (
                                <>
                                    <Link href={`https://wa.me/${orderData?.orderStatus[7]?.Worker?.phoneNumber}`} className="text-black">
                                        <div>
                                            {`${orderData?.orderStatus[7]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[7]?.Worker?.lastName ?? ''}`}
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <FaWhatsapp color="green" />{orderData?.orderStatus[7]?.Worker?.phoneNumber ?? 'No phone number available'}
                                        </div>
                                    </Link>
                                </>

                            ) : orderData?.orderStatus[8]?.status === "DRIVER_TO_CUSTOMER" ? (
                                <>
                                    <Link href={`https://wa.me/${orderData?.orderStatus[8]?.Worker?.phoneNumber}`} className="text-black">
                                        <div>
                                            {`${orderData?.orderStatus[8]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[8]?.Worker?.lastName ?? ''}`}
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <FaWhatsapp color="green" />{orderData?.orderStatus[8]?.Worker?.phoneNumber ?? 'No phone number available'}
                                        </div>
                                    </Link>

                                </>
                            ) : (
                                "Belum Ada Driver"
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-fit py-2 border-t space-y-1 border-neutral-400">
                <div className="flex justify-between text-sm">
                    <h1 className="font-medium">Biaya Kirim:</h1>
                    <p>Rp{orderData?.order?.deliveryFee?.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex justify-between text-sm">
                    <h1 className="font-medium">Harga Laundry:</h1>
                    <p>Rp{orderData?.order?.laundryPrice?.toLocaleString("id-ID")}</p>
                </div>
                <div className="flex justify-between text-sm">
                    <h1 className="font-medium">Total Harga:</h1>
                    <p>Rp{(orderData?.order?.deliveryFee + orderData?.order?.laundryPrice)?.toLocaleString("id-ID")}</p>
                </div>
            </div>
        </>
    )
}