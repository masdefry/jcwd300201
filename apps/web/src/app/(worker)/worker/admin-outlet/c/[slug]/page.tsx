'use client'

import { FaWhatsapp, FaStore } from "react-icons/fa";
import { MdOutlineStickyNote2 } from "react-icons/md";
import Image from "next/image";
import { MdOutlineIron } from "react-icons/md";
import { CgSmartHomeWashMachine } from "react-icons/cg";
import { FaMotorcycle } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
// import RealTimeClock from "@/features/worker/components/realTimeClock";
import { BsPerson } from "react-icons/bs";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import HeaderMobile from "@/components/core/headerMobile"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useToast } from "@/components/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useEffect } from 'react';
import { Interface } from "readline";


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
    itemNameId: number;
    quantity: number;
    weight: number;
};

export default function Page({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = React.use(params);

    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);
    console.log(token)
    const { toast } = useToast();

    const { mutate: handleCreateNotaOrder, isPending } = useMutation({
        mutationFn: async ({ email, totalWeight, totalPrice, items }: any) => {
            return await instance.post(`/worker/order/${slug}`, { email, totalWeight, totalPrice, items }, {
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
        },
        onError: (err: any) => {
            console.log(err)
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })


    const { data: dataOrderNote, isLoading: dataOrderNoteLoading, isFetching } = useQuery({
        queryKey: ['get-order-note'],
        queryFn: async () => {
            const res = await instance.get(`/worker/detail-order-note/${slug}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res?.data?.data, 'ordernote');
            return res?.data?.data;
        },
    });

    console.log(dataOrderNote)

    const { data: dataItemName, isLoading: dataItemNameLoading } = useQuery({
        queryKey: ['get-data-item'],
        queryFn: async () => {
            const res = await instance.get('/worker/item', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res, 'itemname');
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
                                <Link href='/admin/settings'><FaArrowLeft /></Link> Create Order
                            </div>
                        </section>
                        <section className="py-28 px-10">

                            <Formik
                                initialValues={{
                                    items: [],
                                    itemName: '',
                                    quantity: 1,
                                    weight: 0.1,
                                    totalPrice: 0,
                                    totalWeight: 0
                                }}
                                onSubmit={(values: any) => {
                                    console.log(values)
                                    const itemOrder = values.items.map((item: any) => ({
                                        itemNameId: item.itemName,
                                        quantity: item.quantity,
                                    }));


                                    handleCreateNotaOrder({
                                        email: email,
                                        totalWeight: values.totalWeight,
                                        totalPrice: values.totalPrice,
                                        items: values.items
                                    })
                                }}
                            >
                                {({ values, setFieldValue }) => {
                                    
                                    const calculatePrice = () => {
                                        const pricePerKg = dataOrderNote[0].OrderType?.Price || 0;
                                        const totalPrice = values.totalWeight * pricePerKg;
                                        setFieldValue("totalPrice", totalPrice);
                                    };

                                    // eslint-disable-next-line react-hooks/rules-of-hooks
                                    useEffect(() => {
                                        calculatePrice();
                                    }, [values.totalWeight]);

                                    return (
                                        <Form>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Customer Name</label>
                                                    <input
                                                        type="text"
                                                        value={`${dataOrderNote[0].Users?.firstName} ${dataOrderNote[0].Users?.lastName}`}
                                                        disabled
                                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                                    />
                                                </div>

                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Customer Address</label>
                                                    <input
                                                        type="text"
                                                        value={`${dataOrderNote[0].UserAddress?.addressDetail}, ${dataOrderNote[0].UserAddress?.city}, ${dataOrderNote[0].UserAddress?.province}`}
                                                        disabled
                                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                                    />
                                                </div>

                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Order Type</label>
                                                    <input
                                                        type="text"
                                                        value={dataOrderNote[0].OrderType?.Type}
                                                        disabled
                                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                                    />
                                                </div>

                                                <div className="flex flex-col col-span-2">
                                                    <label className="text-sm">Item</label>
                                                    <Field
                                                        as="select"
                                                        name="itemName"
                                                        className="border border-gray-500 rounded-md p-2"
                                                    >
                                                        <option value="">Select Item</option>
                                                        {dataItemName?.map((item: Iitem, index: number) => (
                                                            <option key={index} value={item?.id}>
                                                                {item?.itemName}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="itemName" component="div" className="text-xs text-red-600" />

                                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                                        <Field
                                                            name="quantity"
                                                            type="number"
                                                            placeholder="Quantity"
                                                            className="border border-gray-500 rounded-md p-2"
                                                            min="1"
                                                        />
                                            
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const existingItemIndex = values.items.findIndex(
                                                                (item: Iitem) => item.itemName === values.itemName
                                                            );

                                                            if (existingItemIndex !== -1) {
                                                                const updatedItems = [...values.items];
                                                                updatedItems[existingItemIndex].quantity += values.quantity;
                                                                setFieldValue("items", updatedItems);
                                                            } else {
                                                                setFieldValue("items", [
                                                                    ...values.items,
                                                                    {
                                                                        itemName: values.itemName,
                                                                        quantity: values.quantity,
                                                                    },
                                                                ]);
                                                            }

                                                            setFieldValue("itemName", "");
                                                            setFieldValue("quantity", 1);
                                                        }}
                                                        className="bg-blue-500 text-white rounded-md p-3 mt-4"
                                                    >
                                                        Add Item
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                {values.items.map((item: Iitem, index: number) => {
                                                    const selectedItem = dataItemName.find((i: Iitem) => Number(i.id) === Number(item.itemName));
                                                    return (
                                                        <div key={index} className="bg-blue-50 p-4 mb-2 rounded-lg">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="text-lg font-semibold">
                                                                        {selectedItem ? selectedItem.itemName : 'Item not found'}
                                                                    </h3>
                                                                    <p className="text-gray-600 mt-1">
                                                                        Quantity: {item.quantity}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const updatedItems = values.items.filter((_: any, i: number) => i !== index);
                                                                        setFieldValue("items", updatedItems);
                                                                        // calculateTotals();
                                                                    }}
                                                                    className="text-red-500"
                                                                >
                                                                    <FaRegTrashAlt />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-4 flex items-center gap-4">
                                                <label className="block text-sm font-medium text-gray-700">Total Berat (kg)</label>
                                                <div className="relative mt-2">
                                                <Field
                                                    name="totalWeight"
                                                    type="number"
                                                    placeholder="Enter total weight"
                                                    className="block w-full rounded-lg border-gray-500 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
                                                    min="1"
                                                    step="1"
                                                />
                                                <ErrorMessage
                                                    name="totalWeight"
                                                    component="div"
                                                    className="absolute -bottom-5 left-0 text-xs text-red-600"
                                                />
                                                </div>
                                            </div>

       
                                            <div className="mt-5 bg-gray-50 rounded-lg shadow-sm p-4">
                                                <p className="text-sm font-semibold text-gray-700">Ringkasan</p>
                                                <p className="text-lg font-bold text-green-600 mt-1">Total Harga: Rp{values.totalPrice.toLocaleString('id-ID')}</p>
                                            </div>
                                           
                                            <button
                                                type="submit"
                                                className="bg-green-500 text-white rounded-md p-3 mt-4"
                                            >
                                                Submit Order
                                            </button>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </section>
                    </main>
                </section>
            </main>
        </>
    );
}