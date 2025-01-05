'use client'

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import HeaderMobile from "@/components/core/headerMobile"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaRegTrashAlt } from "react-icons/fa";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useToast } from "@/components/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ContentWebLayout from "@/components/core/webSessionContent";
import NotaHeader from "@/components/core/createNotaHeaders";
import InputDisplay from "@/features/adminOutlet/components/inputDisplay";
import { FaWallet } from "react-icons/fa6";
import { RiBankCardFill } from "react-icons/ri";
import ButtonCustom from "@/components/core/button";
import Image from "next/image";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";


const validationSchema = Yup.object().shape({
    customerName: Yup.string().required("Customer name is required"),
    customerAddress: Yup.string().required("Customer address is required"),
    orderTypeId: Yup.string().required("Order type is required"),
    items: Yup.array()
        .of(
            Yup.object().shape({
                itemName: Yup.string().required("Item name is required"),
                quantity: Yup.number()
                    .required("Quantity is required")
                    .min(1, "Quantity must be at least 1"),
                weight: Yup.number()
                    .required("Weight is required")
                    .min(0.1, "Weight must be at least 0.1 kg"),
            })
        )
        .min(1, "At least one item is required"),
});

interface ICreateOrder {
    id: string,
    values: FormData
}
type Iitem = {
    id: number,
    itemName: string,
    laundryItemId: number;
    quantity: number;
    weight: number;
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState<boolean>(false)
    const [isPaymentMethod, setIsPaymentMethod] = useState<string>('')

    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);
    const { toast } = useToast();
    
    const { data: dataOrderNote, refetch, isLoading: dataOrderNoteLoading, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/order/orders-detail/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handlePaymmentOrder, isPending } = useMutation({
        mutationFn: async ({ email }: any) => {
            return await instance.post(`/order/payment/${slug}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: any) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            setTimeout(() => {
                router.push(res?.data?.OrderUrl?.paymentProof);
            }, 1000);
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    const { mutate: uploadPaymentProof, isPending: isUploading } = useMutation({
        mutationFn: async (fd: FormData) => {
            return await instance.post(`/order/payment-tf/${slug}`, fd, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-green-500 text-white p-4 rounded-lg shadow-lg",
            })

            refetch()
            setIsUploadDialogOpen(false);
        },
        onError: (error: any) => {
            toast({
                description: error.response?.data?.message || "Upload failed",
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg",
            });
        },
    });

    const isArrCardPayment = [
        { img: '/images/bca-card.png' },
        { img: '/images/bank-tf.png' },
        { img: '/images/dana-card.png' },
        { img: '/images/e-wallet.png' },
    ]

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
                        <InputDisplay caption="Ongkos Kirim" value={dataOrderNote?.order?.deliveryFee || '0'} />
                        <InputDisplay caption="Biaya Laundry" value={dataOrderNote?.order?.laundryPrice || '0'} />
                    </div>
                </div>
                <div className="w-full md:w-1/2 space-y-4 pb-28">
                    <h1 className="font-bold text-2xl text-gray-800">Metode Pembayaran</h1>
                    <div className="w-full h-fit">
                        <div className="flex justify-start w-full h-fit">
                            <div className="grid grid-cols-4 h-fit gap-2">
                                {isArrCardPayment.map((img: { img: string }, i: number) => (
                                    <div key={i} className='w-fit h-fit flex justify-center'>
                                        <Image
                                            className='w-fit h-10'
                                            width={500}
                                            height={500}
                                            alt='card'
                                            src={img?.img}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {dataOrderNote?.order?.isPaid === false && !dataOrderNote?.order?.paymentProof ? (
                        <>
                            <div className="space-y-4">
                                <label htmlFor="midtrans-mobile" className="flex items-center justify-between p-4 gap-2 w-full border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <div className='flex gap-2 items-center'>
                                        <FaWallet className="text-lg" />
                                        <span className="text-gray-700 flex">Pembayaran Online</span>
                                    </div>
                                    <input onChange={(e: any) => setIsPaymentMethod(e.target.value)} value='midtrans-mobile' type="radio" name="paymentMethod" id="midtrans-mobile" className="w-4 h-4 text-blue-600" />
                                </label>
                                <label htmlFor="manualTransfer-mobile" className="flex items-center justify-between p-4 gap-2 w-full border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                    <div className='flex gap-2 items-center'>
                                        <RiBankCardFill className="text-lg" />
                                        <span className="text-gray-700 flex">Transfer Bank</span>
                                    </div>
                                    <input onChange={(e: any) => setIsPaymentMethod(e.target.value)} value='manualTransfer-mobile' type="radio" name="paymentMethod" id="manualTransfer-mobile" className="w-4 h-4 text-blue-600" />
                                </label>
                            </div>
                            <ButtonCustom type="button" btnColor="bg-blue-500 hover:bg-blue-500" disabled={!isPaymentMethod || dataOrderNote?.order?.laundryPrice === null || dataOrderNote?.order?.laundryPrice === 0} width="w-full" onClick={() => {
                                isPaymentMethod === 'midtrans' || isPaymentMethod === 'midtrans-mobile' ? handlePaymmentOrder(dataOrderNote?.order?.id) : setIsUploadDialogOpen(true)
                            }}>Bayar sekarang</ButtonCustom>
                        </>
                    ) : (
                        <div className="text-lg mt-8 border-gray-300 p-4">
                            <h1 className="font-bold">Terima kasih,</h1>
                            <p>Anda Telah Melakukan Pembayaran!</p>
                        </div>
                    )}
                </div>
            </MobileSessionLayout>

            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
                        <DialogDescription>
                            Silakan unggah bukti pembayaran Anda di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    <Formik
                        initialValues={{ images: null }}
                        onSubmit={(values: any) => {
                            const fd = new FormData();
                            fd.append("images", values.images);
                            uploadPaymentProof(fd)
                        }}>
                        {({ setFieldValue }) => (
                            <Form>
                                <div className="mt-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-600">
                                        Upload File
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event: any) => setFieldValue("images", event.currentTarget.files[0])}
                                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onClick={() => setIsUploadDialogOpen(false)}
                                        disabled={isUploading}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700"
                                        disabled={isUploading}>
                                        {isUploading ? "Uploading..." : "Upload"}
                                    </Button>
                                </DialogFooter>
                            </Form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            <ContentWebLayout caption='Detail Pembayaran'>
                <NotaHeader />
                <div className="w-full flex gap-4 p-6">
                    <div className="w-full md:w-1/2 space-y-4">
                        <h1 className="font-bold text-2xl text-gray-800 mb-4">Detail Pesanan</h1>
                        <div className="space-y-3">
                            <InputDisplay caption="Order ID" value={dataOrderNote?.order?.id || 'ORD123123'} />
                            <InputDisplay caption="Ongkos Kirim" value={dataOrderNote?.order?.deliveryFee || '0'} />
                            <InputDisplay caption="Biaya Laundry" value={dataOrderNote?.order?.laundryPrice || '0'} />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 space-y-4">
                        <h1 className="font-bold text-2xl text-gray-800">Metode Pembayaran</h1>
                        <div className="w-full h-fit">
                            <div className="flex justify-start w-full h-fit">
                                <div className="grid grid-cols-4 h-fit gap-2">
                                    {isArrCardPayment.map((img: { img: string }, i: number) => (
                                        <div key={i} className='w-fit h-fit flex justify-center'>
                                            <Image
                                                className='w-fit h-10'
                                                width={500}
                                                height={500}
                                                alt='card'
                                                src={img?.img}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {dataOrderNote?.order?.isPaid === false && !dataOrderNote?.order?.paymentProof ? (
                            <>
                                <div className="space-y-4">
                                    <label htmlFor="midtrans" className="flex items-center justify-between p-4 gap-2 w-full border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                        <div className='flex gap-2 items-center'>
                                            <FaWallet className="text-lg" />
                                            <span className="text-gray-700 flex">Pembayaran Online</span>
                                        </div>
                                        <input onChange={(e: any) => setIsPaymentMethod(e.target.value)} value='midtrans' type="radio" name="paymentMethod" id="midtrans" className="w-4 h-4 text-blue-600" />
                                    </label>
                                    <label htmlFor="manualTransfer" className="flex items-center justify-between p-4 gap-2 w-full border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                        <div className='flex gap-2 items-center'>
                                            <RiBankCardFill className="text-lg" />
                                            <span className="text-gray-700 flex">Transfer Bank</span>
                                        </div>
                                        <input onChange={(e: any) => setIsPaymentMethod(e.target.value)} value='manualTransfer' type="radio" name="paymentMethod" id="manualTransfer" className="w-4 h-4 text-blue-600" />
                                    </label>
                                </div>
                                <ButtonCustom type="button" btnColor="bg-blue-500 hover:bg-blue-500" disabled={!isPaymentMethod || dataOrderNote?.order?.laundryPrice === null || dataOrderNote?.order?.laundryPrice === 0} width="w-full" onClick={() => {
                                    isPaymentMethod === 'midtrans' ? handlePaymmentOrder(dataOrderNote?.order?.id) : setIsUploadDialogOpen(true)
                                }}>Bayar sekarang</ButtonCustom>
                            </>
                        ) : (
                            <div className="text-lg mt-8 border-gray-300 p-4">
                                <h1 className="font-bold">Terima kasih,</h1>
                                <p>Anda Telah Melakukan Pembayaran!</p>
                            </div>
                        )}
                    </div>
                </div>
            </ContentWebLayout >
        </>
    );
}