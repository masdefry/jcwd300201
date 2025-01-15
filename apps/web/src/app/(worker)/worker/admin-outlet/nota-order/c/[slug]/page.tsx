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
import NotaCaptionContent from "@/features/adminOutlet/components/NotaCaptionContent";
import InputDisplay from "@/features/adminOutlet/components/InputDisplay";
import TableHeadLayout from "@/features/adminOutlet/components/TableHeadLayout";
import TableHeadContentProduct from "@/features/adminOutlet/components/TableContentProductNotaOrder";
import TableProductNotFound from "@/features/adminOutlet/components/TableProductNotaNotFound";
import TableContentProduct from "@/features/adminOutlet/components/TableBodyContentProduct";
import TotalWeightComponent from "@/features/adminOutlet/components/TotalWeightComponent";
import TableWeightComponent from "@/features/adminOutlet/components/TableWeightNotaOrder";
import { useCreateNotaOrderHook } from "@/features/adminOutlet/hooks/useCreateNotaOrderHook";
import NotaHeader from "@/components/core/createNotaHeaders";
import { notaOrderValidationSchema } from "@/features/adminOutlet/schemas/notaOrderValidationSchema";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import FormikAdminOutletWeb from "@/features/adminOutlet/components/FormikAdminOutletWeb";
import FormikAdminOutletMobile from "@/features/adminOutlet/components/FormikAdminOutletMobile";

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
        dataOrderNote, isFetching, dataItemName } = useCreateNotaOrderHook({ params })

    if (dataOrderNote == undefined) return <div></div>
    if (isFetching) return <div></div>

    return (
        <>
            <MobileSessionLayout title='Buat Nota Order'>
                <NotaHeader email={email} />
                <FormikAdminOutletMobile
                    dataItemName={dataItemName}
                    dataOrderNote={dataOrderNote}
                    isDisabledSucces={isDisabledSucces}
                    setIsCheckedItem={setIsCheckedItem}
                    isCheckedItem={isCheckedItem}
                    handleCreateNotaOrder={handleCreateNotaOrder}
                    email={email}
                    createNotaPending={createNotaPending}

                />
            </MobileSessionLayout>

            <ContentWebLayout caption='Buat Nota Order'>
                <div className="pb-10 min-h-full h-fit w-full">
                    <NotaHeader email={email} />
                    <NotaCaptionContent />
                    <FormikAdminOutletWeb
                        dataItemName={dataItemName}
                        dataOrderNote={dataOrderNote}
                        isDisabledSucces={isDisabledSucces}
                        setIsCheckedItem={setIsCheckedItem}
                        isCheckedItem={isCheckedItem}
                        handleCreateNotaOrder={handleCreateNotaOrder}
                        email={email}
                        createNotaPending={createNotaPending}

                    />
                </div>
            </ContentWebLayout>
        </>
    );
}