'use client'

import "leaflet/dist/leaflet.css";
import ContentWebLayout from "@/components/core/WebSessionContent";
import { locationStore } from "@/zustand/locationStore";
import { instance } from "@/utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, } from "react-leaflet";
import LocationPicker from "@/components/core/LocationPicker";
import ButtonCustom from "@/components/core/Button";
import { createOutletValidationSchema } from "@/features/superAdmin/schemas/createOutletValidationSchema";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { useCreateOutletHook } from "@/features/superAdmin/hooks/useCreateOutletHook";
import CreateOutletMobile from "@/features/superAdmin/components/CreateOutletMobile";
import CreateOutletWeb from "@/features/superAdmin/components/CreateOutletMobile";

export default function CreateOutlet() {
    const {
        lngGlobal, token, time, isPosition, setIsPosition, selectedProvince, setSelectedProvince, dataUser, setDataUser,
        cities, citiesLoading, provinces, provincesLoading, handleSubmitAddStore, isPending,
    } = useCreateOutletHook()

    return (
        <>
            <MobileSessionLayout title='Tambah Outlet Baru'>
                <div className='w-full h-full flex'>
                    <CreateOutletMobile
                        isPosition={isPosition}
                        provinces={provinces}
                        cities={cities}
                        provincesLoading={provincesLoading}
                        citiesLoading={citiesLoading}
                        handleSubmitAddStore={handleSubmitAddStore}
                        setSelectedProvince={setSelectedProvince}
                        time={time}
                        selectedProvince={selectedProvince}
                        setIsPosition={setIsPosition}
                        isPending={isPending}
                    />
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Tambah Outlet Baru">
                <div className='w-full h-full flex'>
                    <CreateOutletWeb
                        isPosition={isPosition}
                        provinces={provinces}
                        cities={cities}
                        provincesLoading={provincesLoading}
                        citiesLoading={citiesLoading}
                        handleSubmitAddStore={handleSubmitAddStore}
                        setSelectedProvince={setSelectedProvince}
                        time={time}
                        selectedProvince={selectedProvince}
                        setIsPosition={setIsPosition}
                        isPending={isPending}
                    />
                </div>
            </ContentWebLayout>
        </>
    );
}