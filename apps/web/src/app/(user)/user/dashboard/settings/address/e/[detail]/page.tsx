'use client'

import "leaflet/dist/leaflet.css";
import ContentWebLayout from "@/components/core/webSessionContent";
import { instance } from "@/utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { use, useEffect, useMemo, useState } from "react";
import { locationStore } from "@/zustand/locationStore";
import axios from "axios";
import L from 'leaflet'
import ButtonCustom from "@/components/core/buttonCustom";
import authStore from "@/zustand/authoStore";
import { toast } from "@/components/hooks/use-toast";
import { IAddressDetail, ICity, IProvince } from "./types";
import { useRouter } from "next/navigation";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { createAddressValidationSchema } from "@/features/user/schemas/createAddressValidationSchema";

export default function Page({ params }: { params: Promise<any> }) {
    const { detail } = use(params)
    const addressId = detail?.split('CNC')[0]
    const router = useRouter()
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

    const { mutate: addUserAddress, isPending } = useMutation({
        mutationFn: async ({ addressName, addressDetail, province, city, zipCode, latitude, longitude }: IAddressDetail) => {
            return await instance.patch(`/user/address/${addressId}`, {
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
        const getLocation = async (): Promise<void> => {
                try {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${isPosition?.lat?.toString()}&lon=${isPosition?.lng?.toString()}&format=json`)
                    setDataUser(response?.data)
        
                } catch (error) {
        
                }
            }

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

    const { data: getSingleUserAddress, isFetching, refetch } = useQuery({
        queryKey: ['get-single-address'],
        queryFn: async () => {
            const response = await instance.get(`/user/address/${addressId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response?.data?.data
        },
    })

    const time = useMemo(() => new Date().getTime(), [])
    if (isFetching) return <div>....</div>

    return (
        <>
            <MobileSessionLayout title='Ubah Alamat'>
                <div className='w-full h-full flex'>
                    <Formik
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            addUserAddress({
                                addressName: values?.addressName,
                                addressDetail: values?.addressDetail,
                                province: values?.province,
                                city: values?.city,
                                zipCode: values?.zipCode,
                                latitude: String(isPosition?.lat),
                                longitude: String(isPosition?.lng)
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

                        initialValues={getSingleUserAddress ? {
                            addressName: getSingleUserAddress?.addressName || "",
                            addressDetail: getSingleUserAddress?.addressDetail || "",
                            province: "",
                            city: getSingleUserAddress?.city || "",
                            zipCode: getSingleUserAddress?.zipCode || "",
                            latitude: getSingleUserAddress?.latitude || "",
                            longitude: getSingleUserAddress?.longitude || "",
                        } : {
                            addressName: "",
                            addressDetail: "",
                            province: "",
                            city: "",
                            zipCode: "",
                            latitude: "",
                            longitude: "",
                        }}>
                        {({ setFieldValue, values, handleChange }) => (
                            <Form className="flex gap-5 h-full w-full justify-center">
                                <div className="flex flex-col pb-5 pr-2 justify-center gap-4 w-full h-full overflow-y-auto">
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="addressName" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                        <Field type='text' name='addressName' placeholder='Rumah / Kantor' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
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
                                                    <option key={city.city_id} value={city.city_name}>
                                                        {city.city_name}
                                                    </option>
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
                                    <ButtonCustom onClick={() => router.push('/user/dashboard/settings/address/set-location')} disabled={isPending} width="w-full" btnColor="bg-blue-500 hover:bg-blue-600" txtColor="text-white" type="button">
                                        Dapatkan posisi terkini
                                    </ButtonCustom>
                                    <ButtonCustom disabled={isPending || !values?.addressDetail || !values?.addressName || !values?.city || !values?.province || !values?.zipCode} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                        {isPending ? 'Memproses..' : 'Ubah Alamat'}
                                    </ButtonCustom>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Ubah alamat">
                <div className='w-full h-full flex'>
                    <Formik
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            addUserAddress({
                                addressName: values?.addressName,
                                addressDetail: values?.addressDetail,
                                province: values?.province,
                                city: values?.city,
                                zipCode: values?.zipCode,
                                latitude: String(isPosition?.lat),
                                longitude: String(isPosition?.lng)
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

                        initialValues={getSingleUserAddress ? {
                            addressName: getSingleUserAddress?.addressName || "",
                            addressDetail: getSingleUserAddress?.addressDetail || "",
                            province: "",
                            city: getSingleUserAddress?.city || "",
                            zipCode: getSingleUserAddress?.zipCode || "",
                            latitude: getSingleUserAddress?.latitude || "",
                            longitude: getSingleUserAddress?.longitude || "",
                        } : {
                            addressName: "",
                            addressDetail: "",
                            province: "",
                            city: "",
                            zipCode: "",
                            latitude: "",
                            longitude: "",
                        }}>
                        {({ setFieldValue, values, handleChange }) => (
                            <Form className="flex gap-5 h-full w-full justify-center">
                                <div className="flex flex-col pb-5 pr-2 justify-center gap-4 w-full h-full overflow-y-auto">
                                    <ButtonCustom onClick={() => router.push('/user/dashboard/settings/address/set-location')} disabled={isPending} width="w-full" btnColor="bg-blue-500 hover:bg-blue-600" txtColor="text-white" type="button">
                                        Dapatkan posisi terkini
                                    </ButtonCustom>
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="addressName" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                        <Field type='text' name='addressName' placeholder='Rumah / Kantor' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
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
                                                    <option key={city.city_id} value={city.city_name}>
                                                        {city.city_name}
                                                    </option>
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
                                        {isPending ? 'Memproses..' : 'Ubah Alamat'}
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
