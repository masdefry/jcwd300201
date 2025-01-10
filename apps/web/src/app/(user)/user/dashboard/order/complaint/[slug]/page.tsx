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
import { paymentValidationSchema } from "@/features/user/schemas/paymentValidationSchema";
import { userComplaintValidationSchema } from "@/features/user/schemas/userComplaintValidationSchema";


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

    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state?.token);
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

    const { mutate: handleComplaint, isPending } = useMutation({
        mutationFn: async ({ complaintText }: any) => {
            return await instance.patch(`/order/complaint/${slug}`, { complaintText }, {
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
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })



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
                    <Formik
                        initialValues={{
                            complaintText: '',
                        }}
                        validationSchema={userComplaintValidationSchema}
                        onSubmit={(values) => {
                            handleComplaint({
                                complaintText: values.complaintText
                            })
                        }}
                    >
                        {({ setFieldValue }) => (
                            <Form className="space-y-4">
                                <div>

                                    <Field
                                        as="textarea"
                                        id="complaintText"
                                        name="complaintText"
                                        placeholder="Tuliskan komplain Anda"
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                            setFieldValue('complaintText', e.target.value);
                                        }}
                                    />
                                    <ErrorMessage
                                        name="complaintText"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                                <ButtonCustom
                                    disabled={isPending}
                                    btnColor="bg-blue-500 hover:bg-blue-600" type="submit" width="w-full"
                                >
                                    {isPending ? 'Mengirim Komplain..' : 'Kirim Komplain'}
                                </ButtonCustom>
                            </Form>
                        )}
                    </Formik>
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
                            <Formik
                                initialValues={{
                                    complaintText: '',
                                }}
                                validationSchema={userComplaintValidationSchema}
                                onSubmit={(values) => {
                                    handleComplaint({
                                        complaintText: values.complaintText
                                    })
                                }}
                            >
                                {({ setFieldValue, values }) => (
                                    <Form className="space-y-4">
                                        <div>

                                            <Field
                                                as="textarea"
                                                id="complaintText"
                                                name="complaintText"
                                                placeholder="Tuliskan komplain Anda"
                                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                                    setFieldValue('complaintText', e.target.value);
                                                }}
                                            />
                                            <ErrorMessage
                                                name="complaintText"
                                                component="div"
                                                className="text-red-500 text-sm mt-1"
                                            />
                                        </div>
                                        <ButtonCustom
                                            disabled={isPending || !values.complaintText}
                                            btnColor="bg-blue-500 hover:bg-blue-600" type="submit" width="w-full"
                                        >
                                            {isPending ? 'Memproses Komplain..' : 'Kirim Komplain'}
                                        </ButtonCustom>
                                    </Form>
                                )}
                            </Formik>
                            :
                            <>
                                <div className="border p-2 bg-gray-100 border-gray-600 w-full rounded-xl">{dataOrderNote?.order?.complaintText}</div>
                                <div>Laporan anda sudah kami proses, mohon menunggu. Terima kasih.</div>
                            </>}

                    </div>
                </div>
            </ContentWebLayout >
        </>
    );
}