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
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";

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
            <MobileSessionLayout title='Buat Nota Order'>
                <NotaHeader email={email} />
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
                            <Form className="min-h-fit pb-28 w-full space-y-4 gap-4">
                                <div className="w-full bg-white">
                                    <div className="space-y-5">
                                        <InputDisplay value={`${dataOrderNote[0].User?.firstName} ${dataOrderNote[0].User?.lastName}`} caption="Nama Pelanggan" />
                                        <InputDisplay value={`${dataOrderNote[0].UserAddress?.addressDetail}, ${dataOrderNote[0].UserAddress?.city}, ${dataOrderNote[0].UserAddress?.province}`} caption="Alamat Pelanggan" />
                                        <InputDisplay value={dataOrderNote[0].OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : dataOrderNote[0].OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : dataOrderNote[0].OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : 'Layanan Kami'} caption="Tipe Order" />
                                        <div className="flex flex-col gap-2">
                                            <div className='flex w-full gap-2 items-end'>
                                                <div className='w-full'>
                                                    <label className="font-semibold">Produk <span className="text-red-600">*</span></label>
                                                    <Field as="select" name="itemName" onChange={(e: any) => {
                                                            setIsCheckedItem(false)
                                                            setFieldValue('itemName', e.target.value)
                                                        }} className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md">
                                                        <option value="" disabled>Select Item</option>
                                                        {dataItemName?.map((item: Iitem, index: number) => (
                                                            <option key={index} value={item?.id}>{item?.itemName}</option>
                                                        ))}
                                                    </Field>
                                                    <ErrorMessage name="itemName" component="div" className="text-xs text-red-600" />
                                                </div>
                                                <div className="w-full">
                                                    <label className="font-semibold">Jumlah <span className="text-red-600">*</span></label>
                                                    <Field name="quantity" type="number" placeholder="Quantity" max="1000" className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md" min="1" />
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
            </MobileSessionLayout>

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
                                                        <Field name="quantity" type="number" placeholder="Quantity" max="1000" className="w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500 rounded-md" min="1" />
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