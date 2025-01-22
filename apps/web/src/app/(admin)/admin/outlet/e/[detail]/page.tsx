'use client'

import ButtonCustom from "@/components/core/Button";
import { use, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ContentWebLayout from "@/components/core/WebSessionContent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";
import { updateOutletValidationSchema } from "@/features/superAdmin/schemas/updateOutletValidationSchema";
import { toast } from "@/components/hooks/use-toast";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { useEditOutletHook } from "@/features/superAdmin/hooks/useEditOutletHook";
import EditOutletMobile from "@/features/superAdmin/components/EditOutletMobile";
import EditOutletWeb from "@/features/superAdmin/components/EditOutletWeb";

export default function Page({ params }: { params: Promise<{ detail: string }> }) {
    const {
        router, isDisabledSucces, dataOutlet, isFetching, loadingPage, handleUpdateOutlet, lngGlobal, token, isPosition, setIsPosition, selectedProvince, setSelectedProvince,
        cities, isPositionCheck, citiesLoading, provinces, provincesLoading, isPending,
    } = useEditOutletHook({ params })

    if (isFetching) return <div></div>

    return (
        <>
            <MobileSessionLayout title="Ubah Data Outlet">
                <div className="w-full h-fit pb-28">
                    <EditOutletMobile
                        isPosition={isPosition}
                        provinces={provinces}
                        cities={cities}
                        provincesLoading={provincesLoading}
                        citiesLoading={citiesLoading}
                        dataOutlet={dataOutlet}
                        setSelectedProvince={setSelectedProvince}
                        isPositionCheck={isPositionCheck}
                        selectedProvince={selectedProvince}
                        isDisabledSucces={isDisabledSucces}
                        isPending={isPending}
                        router={router}
                        handleUpdateOutlet={handleUpdateOutlet}
                    />
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Ubah Data Outlet">
                <div className="w-full h-fit">
                    <EditOutletWeb
                        isPosition={isPosition}
                        provinces={provinces}
                        cities={cities}
                        provincesLoading={provincesLoading}
                        citiesLoading={citiesLoading}
                        dataOutlet={dataOutlet}
                        setSelectedProvince={setSelectedProvince}
                        isPositionCheck={isPositionCheck}
                        selectedProvince={selectedProvince}
                        isDisabledSucces={isDisabledSucces}
                        isPending={isPending}
                        router={router}
                        handleUpdateOutlet={handleUpdateOutlet}
                    />
                </div>
            </ContentWebLayout>
        </>
    )
}
