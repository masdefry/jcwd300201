'use client'

import "leaflet/dist/leaflet.css";
import ContentWebLayout from "@/components/core/WebSessionContent";
import { instance } from "@/utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { locationStore } from "@/zustand/locationStore";
import axios from "axios";
import LocationPicker from "@/components/core/LocationPicker";
import L from 'leaflet'
import ButtonCustom from "@/components/core/Button";
import * as Yup from 'yup'
import authStore from "@/zustand/authstore";
import { toast } from "@/components/hooks/use-toast";
import { IAddressDetail, ICity, IProvince } from "./types";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { createAddressValidationSchema } from "@/features/user/schemas/createAddressValidationSchema";

export default function Page() {
    const latitudeGlobal = locationStore((state) => state?.latitude);
    const lngGlobal = locationStore((state) => state?.longitude);
    const token = authStore((state) => state?.token)
    const [isPosition, setIsPosition] = useState({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 });
    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [dataUser, setDataUser] = useState<any>({})

    const { data: cities, isLoading: citiesLoading, isFetching: loadingPage } = useQuery({
        queryKey: ['get-city', selectedProvince],
        queryFn: async () => {
            const res = await instance.get('/order/city', { params: { province_id: selectedProvince } });
            return res?.data?.data?.rajaongkir?.results;
        },
        enabled: !!selectedProvince,
    })

    const { data: provinces, isLoading: provincesLoading } = useQuery({
        queryKey: ['get-province'],
        queryFn: async () => {
            const res = await instance.get('/order/province');
            return res?.data?.data?.rajaongkir?.results
        },
    })

    const getLocation = async (): Promise<void> => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${isPosition?.lat?.toString()}&lon=${isPosition?.lng?.toString()}&format=json`)
            setDataUser(response?.data)

        } catch (error) {

        }
    }

    const { mutate: addUserAddress, isPending } = useMutation({
        mutationFn: async ({ addressName, addressDetail, province, city, zipCode, latitude, longitude }: IAddressDetail) => {
            return await instance.post('/user/address', {
                addressName, addressDetail, province, city, zipCode, latitude, longitude,
            },
                { headers: { Authorization: `Bearer ${token}` } })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    useEffect(() => {
        setIsPosition({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 })
    }, [latitudeGlobal, lngGlobal])

    useEffect(() => {
        if (isPosition.lat && isPosition.lng) {
            getLocation();
        }
    }, [isPosition]);

    useEffect(() => {
        return () => {
            const container: any = L?.DomUtil.get("map-container");
            if (container != null) {
                container._leaflet_id = null;
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            const container: any = L?.DomUtil.get("map-container-mobile");
            if (container != null) {
                container._leaflet_id = null;
            }
        };
    }, []);

    const time = useMemo(() => new Date().getTime(), [])

    return (
        <>
            <MobileSessionLayout title="Tambah Alamat">
                <Formik
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        addUserAddress({
                            addressName: values?.addressName,
                            addressDetail: values?.addressDetail,
                            province: values?.province,
                            city: values?.city,
                            zipCode: values?.zipCode,
                            latitude: values?.latitude.toString(),
                            longitude: values?.longitude.toString()
                        }, {
                            onSuccess: () => {
                                resetForm()
                                setSubmitting(false)
                            },
                            onError: () => {
                                setSubmitting(false)
                            }
                        })

                    }}
                    validationSchema={createAddressValidationSchema}
                    initialValues={{
                        addressName: "",
                        addressDetail: dataUser?.display_name || "",
                        province: "",
                        city: "",
                        zipCode: "",
                        latitude: isPosition?.lat,
                        longitude: isPosition?.lng,
                    }}>
                    {({ setFieldValue, values, handleChange }) => (
                        <Form className="flex flex-col gap-5 h-full w-full justify-center pb-28">
                            <div className="h-96 w-full relative">
                                <MapContainer id="map-container-mobile" key={time} center={isPosition} zoom={13} className="w-full h-full rounded-2xl">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                    <LocationPicker setFieldValue={setFieldValue} position={isPosition} setPosition={setIsPosition} />
                                </MapContainer>
                            </div>
                            <div className="flex flex-col pr-2 justify-center gap-4 w-full h-full overflow-y-auto">
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="addressName" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                    <Field as='select' name='addressName' id='addressName' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500'>
                                        <option value="" disabled>-- Pilih Opsi --</option>
                                        <option value="Rumah">Rumah</option>
                                        <option value="Kantor">Kantor</option>
                                    </Field>
                                    <ErrorMessage component='div' name="addressName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="addressDetail" className="font-semibold">Alamat Lengkap <span className="text-red-600">*</span></label>
                                    <Field type='text' name='addressDetail' placeholder='Masukan alamat lengkap anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="addressDetail" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="province" className="font-semibold">Provinsi <span className="text-red-600">*</span></label>
                                    <Field
                                        as="select"
                                        id="province"
                                        name="province"
                                        value={values.province}
                                        className="border focus:border-orange-500 focus:outline-none text-sm p-2 w-full"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const selectedValue = e.target.value
                                            setFieldValue("province", selectedValue)
                                            setSelectedProvince(selectedValue)
                                            setFieldValue("city", "")
                                        }}>
                                        <option value="" disabled>Pilih Provinsi</option>
                                        {provincesLoading ? (<option disabled>Loading...</option>) : (
                                            provinces?.map((province: IProvince) => (
                                                <option key={province.province_id} value={province.province_id}>
                                                    {province.province}
                                                </option>
                                            ))
                                        )}
                                    </Field>
                                    <ErrorMessage component='div' name="province" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="city" className="font-semibold">Kota <span className="text-red-600">*</span></label>
                                    <Field
                                        as="select"
                                        id="city"
                                        name="city"
                                        value={values.city}
                                        onChange={handleChange}
                                        disabled={!selectedProvince}
                                        className="border focus:border-orange-500 focus:outline-none text-sm p-2 w-full">
                                        <option value="">
                                            {!selectedProvince ? "Silahkan Pilih Provinsi" : "Pilih Kota"}
                                        </option>
                                        {citiesLoading ? (<option disabled>Loading...</option>) : (
                                            cities?.map((city: ICity) => (
                                                <option key={city.city_id} value={city.city_name}>{city.city_name}</option>
                                            ))
                                        )}
                                    </Field>
                                    <ErrorMessage component='div' name="city" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="zipCode" className="font-semibold">Kode Pos <span className="text-red-600">*</span></label>
                                    <Field type='text' name='zipCode' placeholder='Masukan kode pos anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="zipCode" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>
                                <ButtonCustom disabled={isPending || !values?.addressDetail || !values?.addressName || !values?.city || !values?.province || !values?.zipCode} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                    {isPending ? 'Memproses..' : 'Tambah Alamat'}
                                </ButtonCustom>
                            </div>
                        </Form>
                    )}
                </Formik>
            </MobileSessionLayout>

            <ContentWebLayout caption="Tambah alamat">
                <div className='w-full h-full flex'>
                    <Formik
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            addUserAddress({
                                addressName: values?.addressName,
                                addressDetail: values?.addressDetail,
                                province: values?.province,
                                city: values?.city,
                                zipCode: values?.zipCode,
                                latitude: values?.latitude.toString(),
                                longitude: values?.longitude.toString()
                            }, {
                                onSuccess: () => {
                                    resetForm()
                                    setSubmitting(false)
                                },
                                onError: () => {
                                    setSubmitting(false)
                                }
                            })

                        }}
                        validationSchema={createAddressValidationSchema}
                        initialValues={{
                            addressName: "",
                            addressDetail: dataUser?.display_name || "",
                            province: "",
                            city: "",
                            zipCode: "",
                            latitude: isPosition?.lat,
                            longitude: isPosition?.lng,
                        }}>
                        {({ setFieldValue, values, handleChange }) => (
                            <Form className="flex gap-5 h-full w-full justify-center">
                                <div className="h-full w-full relative">
                                    <MapContainer id="map-container" key={time} center={isPosition} zoom={13} className="w-full h-full rounded-2xl">
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationPicker setFieldValue={setFieldValue} position={isPosition} setPosition={setIsPosition} />
                                    </MapContainer>

                                </div>
                                <div className="flex flex-col pr-2 justify-center gap-4 w-full h-full overflow-y-auto">
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="addressName" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                        <Field as='select' name='addressName' id='addressName' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500'>
                                            <option value="" disabled>-- Pilih Opsi --</option>
                                            <option value="Rumah">Rumah</option>
                                            <option value="Kantor">Kantor</option>
                                        </Field>
                                        <ErrorMessage component='div' name="addressName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                    </div>
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="addressDetail" className="font-semibold">Alamat Lengkap <span className="text-red-600">*</span></label>
                                        <Field type='text' name='addressDetail' placeholder='Masukan alamat lengkap anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                        <ErrorMessage component='div' name="addressDetail" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                    </div>
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="province" className="font-semibold">Provinsi <span className="text-red-600">*</span></label>
                                        <Field
                                            as="select"
                                            id="province"
                                            name="province"
                                            value={values.province}
                                            className="border focus:border-orange-500 focus:outline-none text-sm p-2 w-full"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const selectedValue = e.target.value
                                                setFieldValue("province", selectedValue)
                                                setSelectedProvince(selectedValue)
                                                setFieldValue("city", "")
                                            }}>
                                            <option value="" disabled>Pilih Provinsi</option>
                                            {provincesLoading ? (<option disabled>Loading...</option>) : (
                                                provinces?.map((province: IProvince) => (
                                                    <option key={province.province_id} value={province.province_id}>
                                                        {province.province}
                                                    </option>
                                                ))
                                            )}
                                        </Field>
                                        <ErrorMessage component='div' name="province" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                    </div>
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="city" className="font-semibold">Kota <span className="text-red-600">*</span></label>
                                        <Field
                                            as="select"
                                            id="city"
                                            name="city"
                                            value={values.city}
                                            onChange={handleChange}
                                            disabled={!selectedProvince}
                                            className="border focus:border-orange-500 focus:outline-none text-sm p-2 w-full">
                                            <option value="">
                                                {!selectedProvince ? "Silahkan Pilih Provinsi" : "Pilih Kota"}
                                            </option>
                                            {citiesLoading ? (<option disabled>Loading...</option>) : (
                                                cities?.map((city: ICity) => (
                                                    <option key={city.city_id} value={city.city_name}>{city.city_name}</option>
                                                ))
                                            )}
                                        </Field>
                                        <ErrorMessage component='div' name="city" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                    </div>
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="zipCode" className="font-semibold">Kode Pos <span className="text-red-600">*</span></label>
                                        <Field type='text' name='zipCode' placeholder='Masukan kode pos anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                        <ErrorMessage component='div' name="zipCode" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                    </div>
                                    <ButtonCustom disabled={isPending || !values?.addressDetail || !values?.addressName || !values?.city || !values?.province || !values?.zipCode} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                        {isPending ? 'Memproses..' : 'Tambah Alamat'}
                                    </ButtonCustom>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </ContentWebLayout>
        </>
    );
}
