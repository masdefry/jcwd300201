'use client'
// import RealTimeClock from "@/features/worker/components/realTimeClock";
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
import { ConfirmAlert } from "@/components/core/confirmAlert";
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { values } from "cypress/types/lodash";


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
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);
    console.log(token)
    const { toast } = useToast();

    const { mutate: handlePaymmentOrder, isPending } = useMutation({
        mutationFn: async ({ email }: any) => {
            return await instance.post(`/order/payment/${slug}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: any) => {
            console.log(res)
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            setTimeout(() => {
                router.push(res?.data?.OrderUrl?.paymentProof);
            }, 1000);
        },
        onError: (err: any) => {
            console.log(err)
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
            });
            setIsUploadDialogOpen(false);
        },
        onError: (error: any) => {
            toast({
                description: error.response?.data?.message || "Upload failed",
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg",
            });
        },
    });

    const { data: dataOrderNote, isLoading: dataOrderNoteLoading, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/order/orders-detail/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res?.data?.data, 'ordernote');
            return res?.data?.data;
        },
    });


    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>
    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> Payment
                            </div>
                        </section>
                        <section className="py-28 px-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col col-span-2">
                                    <label className="text-sm">Order Id</label>
                                    <input
                                        type="text"
                                        value={dataOrderNote?.order?.id}
                                        disabled
                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm">Delivery Fee</label>
                                    <input
                                        type="text"
                                        value={dataOrderNote?.order?.deliveryFee}
                                        disabled
                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm">Laundry Price</label>
                                    <input
                                        type="text"
                                        value={dataOrderNote?.order?.laundryPrice}
                                        disabled
                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                    />
                                </div>
                                <div className="flex flex-col col-span-2">
                                    <label className="text-sm">Total Price</label>
                                    <input
                                        type="text"
                                        value={dataOrderNote?.order?.totalPrice}
                                        disabled
                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                    />
                                </div>
                            </div>


                            {dataOrderNote?.order?.isPaid === false && !dataOrderNote?.order?.paymentProof ? (
                                <section className="flex justify-center mt-8 flex-col border- rounded-lg border border-gray-300 shadow-lg p-4">
                                    <div className="text-lg font-bold text-center">Pilih Metode Pembayaran</div>
                                    <ConfirmAlert
                                        caption="Apakah anda yakin ingin melakukan pembayaran melalui VA/e-Wallet/Kartu Kredit?"
                                        onClick={() => handlePaymmentOrder(dataOrderNote?.order?.id)}
                                        description='Anda tidak bisa mengganti metode pembayaran setelah memilih'
                                        colorConfirmation="blue"
                                    >
                                        <button
                                            className="bg-blue-500 text-white rounded-md p-3 mt-4"
                                        >
                                            VA / e-Wallet / Kartu Kredit
                                        </button>
                                    </ConfirmAlert>
                                    <div className="mt-4 text-center text-gray-700">atau</div>
                                    <ConfirmAlert
                                        caption="Apakah anda yakin ingin melakukan pembayaran melalui transfer manual?"
                                        onClick={() => setIsUploadDialogOpen(true)}
                                        description='Anda tidak bisa mengganti metode pembayaran setelah memilih'
                                        colorConfirmation="blue"
                                    >
                                        <button
                                            className="bg-blue-500 text-white rounded-md p-3 mt-4"
                                        >
                                            Transfer Manual
                                        </button>
                                    </ConfirmAlert>
                                </section>
                            ) : (
                                <div className="flex text-center text-lg justify-center mt-8 flex-col border- rounded-lg border border-gray-300 shadow-lg p-4">
                                        <div className="font-bold">
                                            Terima kasih,
                                        </div>
                                        <div>
                                            Anda Telah Melakukan Pembayaran!
                                        </div>
                                </div>
                            )}

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
                                            fd.append("orderId", slug);
                                            uploadPaymentProof(fd)
                                        }}
                                    >
                                        {({ setFieldValue }) => (
                                            <Form>
                                                <div className="mt-4">
                                                    <label className="block mb-2 text-sm font-medium text-gray-600">
                                                        Upload File
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(event: any) => {
                                                            setFieldValue("images", event.currentTarget.files[0]);
                                                        }}
                                                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => setIsUploadDialogOpen(false)}
                                                        disabled={isUploading}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        type="submit"
                                                        className="bg-blue-600 hover:bg-blue-700"
                                                        disabled={isUploading}
                                                    >
                                                        {isUploading ? "Uploading..." : "Upload"}
                                                    </Button>
                                                </DialogFooter>
                                            </Form>
                                        )}
                                    </Formik>
                                </DialogContent>
                            </Dialog>
                        </section>
                    </main>
                </section>
            </main>
        </>
    );
}