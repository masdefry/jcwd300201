'use client'

import ButtonCustom from "@/components/core/button";
import { use, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ContentWebLayout from "@/components/core/webSessionContent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";
import { updateOutletValidationSchema } from "@/features/superAdmin/schemas/updateOutletValidationSchema";
import { toast } from "@/components/hooks/use-toast";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";

export default function Page({ params }: { params: Promise<{ detail: string }> }) {
    const { detail } = use(params)
    const token = authStore((state) => state?.token)
    const [selectedProvince, setSelectedProvince] = useState<string>('')

    const latitudeGlobal = locationStore((state) => state?.latitude);
    const lngGlobal = locationStore((state) => state?.longitude);
    const isPositionCheck = locationStore((state) => state?.checkAddressOutlet)
    const setIsPositionCheck = locationStore((state) => state?.setIsPositionCheck)
    const [isPosition, setIsPosition] = useState({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 });
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        setIsPosition({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 })
    }, [latitudeGlobal, lngGlobal])

    const { data: dataOutlet, isFetching } = useQuery({
        queryKey: ['get-data'],
        queryFn: async () => {
            const res = await instance.get(`/store/detail/${detail}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return res?.data?.data
        }
    })

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

    const { mutate: handleUpdateOutlet, isPending } = useMutation({
        mutationFn: async ({ storeName, address, city, province, zipCode, latitude, longitude }: any) => {
            return await instance.patch(`/store/detail/${detail}`, {
                storeName, address, city, province, zipCode, latitude, longitude
            }, { headers: { Authorization: `Bearer ${token}` } })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })

            setIsPositionCheck(false)
            setIsDisabledSucces(true)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })
    if (isFetching) return <div></div>

    return (
        <>
            <MobileSessionLayout title="Ubah Data Outlet">
                <div className="w-full h-fit">
                    <Formik
                        initialValues={{
                            storeName: dataOutlet?.storeName || "",
                            address: dataOutlet?.address || '',
                            province: "",
                            city: "",
                            zipCode: dataOutlet?.zipCode || "",
                            latitude: isPositionCheck ? Number(isPosition?.lat) : dataOutlet?.latitude || null,
                            longitude: isPositionCheck ? Number(isPosition?.lng) : dataOutlet?.longitude || null,
                        }}
                        validationSchema={updateOutletValidationSchema}
                        onSubmit={(values) => {
                            handleUpdateOutlet({
                                storeName: values?.storeName,
                                address: values?.address,
                                province: values?.province,
                                city: values?.city,
                                zipCode: values?.zipCode,
                                latitude: values?.latitude.toString(),
                                longitude: values?.longitude.toString()
                            })
                        }}>
                        {({ values, setFieldValue, handleChange }) => (
                            <Form className='w-full h-fit space-y-3'>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="storeName" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                    <Field type='text' name='storeName' placeholder='CNC - Example' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="storeName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="address" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                    <Field type='text' name='address' placeholder='Rumah / Kantor' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="address" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
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
                                            provinces?.map((province: any) => (
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
                                    <Field as="select" id="city" name="city" value={values.city} onChange={handleChange} disabled={!selectedProvince}
                                        className="border focus:border-orange-500 focus:outline-none text-sm p-2 w-full">
                                        <option value="">{!selectedProvince ? "Silahkan Pilih Provinsi" : "Pilih Kota"}</option>
                                        {citiesLoading ? (<option disabled>Loading...</option>) : (
                                            cities?.map((city: any, i: number) => (
                                                <option key={city?.city_id || i} value={city?.city_name}>{city?.city_name}</option>
                                            ))
                                        )}
                                    </Field>
                                    <ErrorMessage component='div' name="city" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>

                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="zipCode" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                    <Field type='text' name='zipCode' placeholder='Rumah / Kantor' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="zipCode" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>

                                <ButtonCustom onClick={() => {
                                    router.push('/admin/outlet/set-location')
                                }} width="w-full" btnColor="bg-blue-500 hover:bg-blue-600" txtColor="text-white" type="button">
                                    Dapatkan posisi terkini
                                </ButtonCustom>
                                <ButtonCustom disabled={isPending || isDisabledSucces} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                    Ubah
                                </ButtonCustom>
                            </Form>
                        )}
                    </Formik>
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Ubah Data Outlet">
                <div className="w-full h-fit">
                    <Formik
                        initialValues={{
                            storeName: dataOutlet?.storeName || "",
                            address: dataOutlet?.address || '',
                            province: "",
                            city: "",
                            zipCode: dataOutlet?.zipCode || "",
                            latitude: isPositionCheck ? Number(isPosition?.lat) : dataOutlet?.latitude || null,
                            longitude: isPositionCheck ? Number(isPosition?.lng) : dataOutlet?.longitude || null,
                        }}
                        validationSchema={updateOutletValidationSchema}
                        onSubmit={(values) => {
                            handleUpdateOutlet({
                                storeName: values?.storeName,
                                address: values?.address,
                                province: values?.province,
                                city: values?.city,
                                zipCode: values?.zipCode,
                                latitude: values?.latitude.toString(),
                                longitude: values?.longitude.toString()
                            })
                        }}>
                        {({ values, setFieldValue, handleChange }) => (
                            <Form className='w-full h-fit space-y-3'>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="storeName" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                    <Field type='text' name='storeName' placeholder='CNC - Example' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="storeName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>
                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="address" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                    <Field type='text' name='address' placeholder='Rumah / Kantor' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="address" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
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
                                            provinces?.map((province: any) => (
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
                                    <Field as="select" id="city" name="city" value={values.city} onChange={handleChange} disabled={!selectedProvince}
                                        className="border focus:border-orange-500 focus:outline-none text-sm p-2 w-full">
                                        <option value="">{!selectedProvince ? "Silahkan Pilih Provinsi" : "Pilih Kota"}</option>
                                        {citiesLoading ? (<option disabled>Loading...</option>) : (
                                            cities?.map((city: any, i: number) => (
                                                <option key={city?.city_id || i} value={city?.city_name}>{city?.city_name}</option>
                                            ))
                                        )}
                                    </Field>
                                    <ErrorMessage component='div' name="city" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>

                                <div className="w-full flex flex-col gap-2 relative">
                                    <label htmlFor="zipCode" className="font-semibold">Jenis Alamat <span className="text-red-600">*</span></label>
                                    <Field type='text' name='zipCode' placeholder='Rumah / Kantor' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                    <ErrorMessage component='div' name="zipCode" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                </div>

                                <ButtonCustom onClick={() => {
                                    router.push('/admin/outlet/set-location')
                                }} width="w-full" btnColor="bg-blue-500 hover:bg-blue-600" txtColor="text-white" type="button">
                                    Dapatkan posisi terkini
                                </ButtonCustom>
                                <ButtonCustom disabled={isPending || isDisabledSucces} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                    Ubah
                                </ButtonCustom>
                            </Form>
                        )}
                    </Formik>
                </div>
            </ContentWebLayout>
        </>
    )
}
