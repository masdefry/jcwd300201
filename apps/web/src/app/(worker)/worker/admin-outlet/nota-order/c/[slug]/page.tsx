'use client'

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import HeaderMobile from "@/components/core/headerMobile"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaRegTrashAlt } from "react-icons/fa";
import React, { useEffect } from 'react';
import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/button";
import NotaCaptionContent from "@/features/adminOutlet/components/notaCaptionContent";
import InputDisplay from "@/features/adminOutlet/components/inputDisplay";
import TableHeadLayout from "@/features/adminOutlet/components/tableHeadLayout";
import TableHeadContentProduct from "@/features/adminOutlet/components/tableContentProductNotaOrder";
import TableProductNotFound from "@/features/adminOutlet/components/tableProductNotaNotFound";
import TableContentProduct from "@/features/adminOutlet/components/tableBodyContentProduct";
import TotalWeightComponent from "@/features/adminOutlet/components/totalWeightComponent";
import TableWeightComponent from "@/features/adminOutlet/components/tableWeightNotaOrder";
import { useCreateNotaOrderHooks } from "@/features/adminOutlet/hooks/useCreateNotaOrderHooks";
import NotaHeader from "@/components/core/createNotaHeaders";
import { notaOrderValidation } from "@/features/adminOutlet/schemas/notaOrderValidation";



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
    const {
        email, isCheckedItem, setIsCheckedItem, isDisabledSucces, handleCreateNotaOrder, createNotaPending,
        dataOrderNote, isFetching, dataItemName } = useCreateNotaOrderHooks({ params })

    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>

    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit md:hidden block">
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
                                    laundryPrice: 0,
                                    totalWeight: 0
                                }}
                                validationSchema={notaOrderValidation}
                                onSubmit={(values: any) => {
                                    const itemOrder = values.items.map((item: any) => ({
                                        laundryItemId: item.itemName,
                                        quantity: item.quantity,
                                    }));
                                    handleCreateNotaOrder({
                                        email: email,
                                        totalWeight: values.totalWeight,
                                        laundryPrice: values.laundryPrice,
                                        items: values.items
                                    })
                                }}>
                                {({ values, setFieldValue }) => {

                                    const calculatePrice = () => {
                                        const pricePerKg = dataOrderNote[0].OrderType?.price || 0;
                                        const laundryPrice = values.totalWeight * pricePerKg;
                                        setFieldValue("laundryPrice", laundryPrice);
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
                                                        value={`${dataOrderNote[0].User?.firstName} ${dataOrderNote[0].User?.lastName}`}
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
                                                        value={dataOrderNote[0].OrderType?.type}
                                                        disabled
                                                        className="border border-gray-500 rounded-md p-2 bg-gray-200"
                                                    />
                                                </div>

                                                <div className="flex flex-col col-span-2">
                                                    <div className="flex flex-row gap-2">
                                                        <div className="w-2/3 flex flex-col">
                                                            <label className="text-sm">Item</label>
                                                            <Field
                                                                as="select"
                                                                name="itemName"
                                                                className="border border-gray-500 h-10 rounded-md p-2"
                                                            >
                                                                <option value="">Select Item</option>
                                                                {dataItemName?.map((item: Iitem, index: number) => (
                                                                    <option key={index} value={item?.id}>
                                                                        {item?.itemName}
                                                                    </option>
                                                                ))}
                                                            </Field>
                                                            <ErrorMessage name="itemName" component="div" className="text-xs text-red-600" />
                                                        </div>
                                                        <div className=" w-1/3 flex flex-col">
                                                            <label className="text-sm">Quantity</label>
                                                            <Field
                                                                name="quantity"
                                                                type="number"
                                                                placeholder="Quantity"
                                                                className="border border-gray-500 h-10 rounded-md p-2"
                                                                min="1"
                                                            />
                                                            <ErrorMessage name="quantity" component="div" className="text-xs text-red-600" />

                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (!values.itemName) {
                                                                return;
                                                            }
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
                                                        disabled={!values.itemName}
                                                    >
                                                        Add Item
                                                    </button>
                                                </div>
                                            </div>

                                            <ErrorMessage name="items" component="div" className="text-xs text-red-600" />

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
                                                        className="block w-full rounded-lg border-gray-600 shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-3"
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
                                                <p className="text-lg font-bold text-green-600 mt-1">Total Harga: Rp{values.laundryPrice.toLocaleString('id-ID')}</p>
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

            <ContentWebLayout caption='Buat Nota Order'>
                <div className="pb-10 min-h-full h-fit w-full">
                    <NotaHeader email={email} />
                    <NotaCaptionContent />
                    <Formik initialValues={{
                        items: [],
                        itemName: '',
                        quantity: 1,
                        weight: 0.1,
                        laundryPrice: 0,
                        totalWeight: 0
                    }}
                        validationSchema={notaOrderValidation}
                        onSubmit={(values: any) => {
                        console.log(values)
                        const itemOrder = values.items.map((item: any) => ({
                            laundryItemId: item.itemName,
                            quantity: item.quantity,
                        }));

                        handleCreateNotaOrder({
                            email: email,
                            totalWeight: values.totalWeight,
                            laundryPrice: values.laundryPrice,
                            items: values.items
                        })
                    }}>
                        {({ values, setFieldValue }) => {

                            const calculatePrice = () => {
                                const pricePerKg = dataOrderNote[0].OrderType?.price || 0;
                                const laundryPrice = values.totalWeight * pricePerKg;
                                setFieldValue("laundryPrice", laundryPrice);
                            };

                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            useEffect(() => {
                                calculatePrice();
                            }, [values.totalWeight]);

                            return (
                                <Form className="min-h-fit pb-5 w-full flex gap-4">
                                    <div className="w-full bg-white">
                                        <div className="space-y-5">
                                            <InputDisplay value={`${dataOrderNote[0].User?.firstName} ${dataOrderNote[0].User?.lastName}`} caption="Nama Pelanggan" />
                                            <InputDisplay value={`${dataOrderNote[0].UserAddress?.addressDetail}, ${dataOrderNote[0].UserAddress?.city}, ${dataOrderNote[0].UserAddress?.province}`} caption="Alamat Pelanggan" />
                                            <InputDisplay value={dataOrderNote[0].OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : dataOrderNote[0].OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : dataOrderNote[0].OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : 'Layanan Kami'} caption="Tipe Order" />
                                            <div className="flex flex-col gap-2">
                                                <div className='flex w-full gap-2 items-end'>
                                                    <div className='w-full'>
                                                        <label className="font-semibold">Produk Laundry <span className="text-red-600">*</span></label>
                                                        <Field
                                                            as="select"
                                                            name="itemName"
                                                            onChange={(e: any) => {
                                                                setIsCheckedItem(false)
                                                                setFieldValue('itemName', e.target.value)
                                                            }}
                                                            className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md">
                                                            <option value="" disabled>Select Item</option>
                                                            {dataItemName?.map((item: Iitem, index: number) => (
                                                                <option key={index} value={item?.id}>
                                                                    {item?.itemName}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                        <ErrorMessage name="itemName" component="div" className="text-xs text-red-600" />
                                                    </div>
                                                    <div className="w-full">
                                                        <label className="font-semibold">Jumlah <span className="text-red-600">*</span></label>
                                                        <Field name="quantity" type="number" placeholder="Quantity"  max="1000" className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md" min="1" />
                                                    </div>
                                                    <div className='flex flex-col items-end'>
                                                        <ButtonCustom type="button" disabled={isCheckedItem} onClick={() => {
                                                            const existingItemIndex = values.items.findIndex((item: Iitem) => item.itemName === values.itemName)
                                                            if (existingItemIndex !== -1) {
                                                                const updatedItems = [...values.items]
                                                                updatedItems[existingItemIndex].quantity += values.quantity
                                                                setFieldValue("items", updatedItems)
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
                                                            setIsCheckedItem(true)
                                                        }} btnColor="bg-orange-500 hover:bg-orange-500" width="w-fit">+</ButtonCustom>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full min-h-full flex flex-col gap-2">
                                        <div className={`${values?.items?.length >= 5 ? 'h-1/2' : 'h-fit'} w-full overflow-y-auto`}>
                                            <table className="min-w-full bg-white border border-gray-200">
                                                <TableHeadLayout>
                                                    <TableHeadContentProduct />
                                                </TableHeadLayout>
                                                <tbody>
                                                    {values?.items?.length > 0 ?
                                                        values.items.map((item: Iitem, index: number) => {
                                                            const selectedItem = dataItemName.find((i: Iitem) => Number(i.id) === Number(item.itemName));
                                                            return (
                                                                <TableContentProduct index={index} item={item} selectedItem={selectedItem} key={index}>
                                                                    <button onClick={() => {
                                                                        const updatedItems = values.items.filter((_: any, i: number) => i !== index);
                                                                        setFieldValue("items", updatedItems)
                                                                    }} className="text-red-500 hover:text-red-600" type="button">Hapus</button>
                                                                </TableContentProduct>
                                                            )
                                                        }) : <TableProductNotFound />
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <TableWeightComponent values={values} />
                                        {values?.items?.length > 0 && <TotalWeightComponent />}
                                        <ButtonCustom width="w-full" disabled={values?.items?.length === 0 || createNotaPending || isDisabledSucces} btnColor="bg-orange-600 hover:bg-orange-600" type='submit'>
                                            Buat Nota Order
                                        </ButtonCustom>
                                    </div>
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </ContentWebLayout>
        </>
    );
}