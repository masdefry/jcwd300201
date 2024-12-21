'use client'

import "leaflet/dist/leaflet.css";
import LocationPicker from "@/components/core/locationPicker";
import ContentWebSession from "@/components/core/webSessionContent";
import authStore from "@/zustand/authstore";
import { locationStore } from "@/zustand/locationStore";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import L from 'leaflet'
import ButtonCustom from "@/components/core/button";
import { toast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Page() {
    const latitudeGlobal = locationStore((state) => state?.latitude);
    const lngGlobal = locationStore((state) => state?.longitude);
    const setLocation = locationStore((state) => state?.setLocationUser)
    const [pickLocationSuccess, setIsPickLocationSuccess] = useState<boolean>(false)
    const token = authStore((state) => state?.token)
    const [isPosition, setIsPosition] = useState({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 });
    const router = useRouter()

    useEffect(() => {
        return () => {
            const container: any = L?.DomUtil.get("map-container");
            if (container != null) {
                container._leaflet_id = null;
            }
        }
    }, [])

    useEffect(() => {
        setIsPosition({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 })
    }, [latitudeGlobal, lngGlobal])

    const time = useMemo(() => new Date().getTime(), [])
    return (
        <ContentWebSession caption='Pilih Alamat' height="h-full">
            <div className='w-full h-full flex pb-5'>
                <Formik
                    onSubmit={(values) => {
                        setLocation({
                            latitude: Number(values?.latitude) || isPosition?.lat,
                            longitude: Number(values?.longitude) || isPosition?.lng
                        })

                        try {
                            setIsPickLocationSuccess(true)
                            toast({
                                description: 'Berhasil memilih alamat terkini',
                                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
                            })

                            router.back()
                        } catch (error) {
                            toast({
                                description: 'Gagal memilih alamat terkini',
                                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
                            })
                            setIsPickLocationSuccess(false)
                        }
                        console.log(values)
                    }}

                    initialValues={{
                        latitude: "",
                        longitude: "",
                    }}>
                    {({ setFieldValue, values, handleChange }) => (
                        <Form className="flex gap-5 h-[85%] w-full justify-center">
                            <div className="h-full w-full space-y-2">
                                <MapContainer id="map-container" key={time} center={isPosition} zoom={13} className="w-full h-full rounded-2xl">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationPicker setFieldValue={setFieldValue} position={isPosition} setPosition={setIsPosition} />
                                </MapContainer>
                                <ButtonCustom disabled={pickLocationSuccess} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                    Tambah Alamat
                                </ButtonCustom>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </ContentWebSession>
    );
}