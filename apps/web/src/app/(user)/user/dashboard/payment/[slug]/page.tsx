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

    const { slug } = React.use(params);
    const router = useRouter()

    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);
    console.log(token)
    const { toast } = useToast();

    // const { mutate: handleCreateNotaOrder, isPending } = useMutation({
    //     mutationFn: async ({ email, totalWeight, laundryPrice, items }: any) => {
    //         return await instance.post(`/order/order/${slug}`, { email, totalWeight, laundryPrice, items }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //     },
    //     onSuccess: (res: any) => {
    //         console.log(res)
    //         toast({
    //             description: res?.data?.message,
    //             className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
    //         })
    //         setTimeout(() => {
    //             router.push('/worker/admin-outlet/nota-order');
    //         }, 1000);
    //     },
    //     onError: (err: any) => {
    //         console.log(err)
    //         toast({
    //             description: err?.response?.data?.message,
    //             className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
    //         })
    //     }
    // })


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

    // console.log(dataOrderNote)


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

                                <div className="flex flex-col col-span-2">
                                    <label className="text-sm">Delivery Fee</label>
                                    <input
                                        type="text"
                                        value={dataOrderNote?.order?.deliveryFee}
                                        disabled
                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                    />
                                </div>

                                <div className="flex flex-col col-span-2">
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



                            <div>Pilih Metode Pembayaran</div>
                            <button
                                className="bg-blue-500 text-white rounded-md p-3 mt-4"
                                >
                                VA / e-Wallet / Kartu Kredit
                            </button>
                                <div>atau</div>
                            <button
                                className="bg-blue-500 text-white rounded-md p-3 mt-4"
                                >
                                Transfer Manual
                            </button>

                        </section>
                    </main>
                </section>
            </main>
        </>
    );
}