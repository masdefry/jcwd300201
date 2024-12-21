'use client'

import "leaflet/dist/leaflet.css";
import ContentWebSession from "@/components/core/webSessionContent";
import { instance } from "@/utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { use, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { locationStore } from "@/zustand/locationStore";
import axios from "axios";
import LocationPicker from "@/components/core/locationPicker";
import L from 'leaflet'
import { TextField } from "@mui/material";
import ButtonCustom from "@/components/core/button";
import HeaderMobileUser from "@/components/core/headerMobileUser";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import * as Yup from 'yup'
import authStore from "@/zustand/authstore";
import { toast } from "@/components/hooks/use-toast";
import { IAddressDetail } from "./types";

export default function Page({ params }: { params: Promise<any> }) {
    const { detail } = use(params)
    const addressId = detail?.split('CNC')[0]
    const latitudeGlobal = locationStore((state) => state?.latitude);
    const lngGlobal = locationStore((state) => state?.longitude);
    const token = authStore((state) => state?.token)
    const [isPosition, setIsPosition] = useState({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 });
    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [dataUser, setDataUser] = useState<any>({})
    const [initialValues, setInitialValues] = useState({
        addressName: "",
        addressDetail: "",
        province: "",
        city: "",
        zipCode: "",
        latitude: "",
        longitude: "",
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

    const getLocation = async (): Promise<void> => {
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${isPosition?.lat?.toString()}&lon=${isPosition?.lng?.toString()}&format=json`)
            setDataUser(response?.data)

        } catch (error) {
            console.log(error)
        }
    }

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

            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
            console.log(err)
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

    const { data: getSingleUserAddress, isLoading, refetch } = useQuery({
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

    useEffect(() => {
        if (getSingleUserAddress) {
            setInitialValues({
                addressName: getSingleUserAddress?.addressName || "",
                addressDetail: getSingleUserAddress?.addressDetail || "",
                province: getSingleUserAddress?.province || "",
                city: getSingleUserAddress?.city || "",
                zipCode: getSingleUserAddress?.zipCode || "",
                latitude: getSingleUserAddress?.latitude || "",
                longitude: getSingleUserAddress?.longitude || "",
            })
        }
    }, [getSingleUserAddress])

    return (
        <>
            <main className="w-full h-fit block md:hidden">
                <section className="w-full h-fit">
                    <HeaderMobileUser />
                    <main className="mx-8">
                        <section className="flex gap-2 items-center bg-white w-full z-50 font-bold  fixed pt-2 mt-14 text-lg border-b-2 pb-4">
                            <Link href='/users/settings/address'><FaArrowLeft /></Link> TAMBAH ALAMAT
                        </section>
                        <Formik
                            initialValues={{
                                addressName: "",
                                addressDetail: "",
                                province: "",
                                city: "",
                                zipCode: "",
                                latitude: "",
                                longitude: "",
                            }}
                            validationSchema={Yup.object({
                                addressName: Yup.string().required("Nama Alamat harap diisi!"),
                                addressDetail: Yup.string().required("Alamat harap diisi!"),
                                province: Yup.string().required("Provinsi harap diisi!"),
                                city: Yup.string().required("Kota harap diisi!"),
                                zipCode: Yup.string().required("Kode Pos harap diisi!"),
                            })}
                            onSubmit={(values) => {
                                addUserAddress({
                                    addressName: values.addressName,
                                    addressDetail: values.addressDetail,
                                    province: values.province,
                                    city: values.city,
                                    zipCode: values.zipCode,
                                    latitude: String(isPosition?.lat),
                                    longitude: String(isPosition?.lng)
                                })
                            }}
                        >
                            {({ values, setFieldValue, handleChange, errors, touched }) => (
                                <Form>
                                    <div className="py-36 flex gap-4 flex-wrap justify-center flex-col ">
                                        <TextField
                                            id="addressName"
                                            name="addressName"
                                            label="Nama Alamat"
                                            value={values.addressName}
                                            onChange={handleChange}
                                            placeholder="Rumah "
                                            size="small"
                                            fullWidth
                                            error={touched.addressName && Boolean(errors.addressName)}
                                            helperText={touched.addressName && errors.addressName}
                                        />
                                        <TextField
                                            id="addressDetail"
                                            name="addressDetail"
                                            label="Alamat"
                                            value={values.addressDetail}
                                            onChange={handleChange}
                                            placeholder="Jl. Rancak Banai no.76"
                                            size="small"
                                            fullWidth
                                            error={touched.addressDetail && Boolean(errors.addressDetail)}
                                            helperText={touched.addressDetail && errors.addressDetail}
                                        />
                                        <div>
                                            {/* <label htmlFor="province">Provinsi</label> */}
                                            <Field
                                                as="select"
                                                id="province"
                                                name="province"
                                                value={values.province}
                                                className="border border-gray-400 rounded-md p-2 w-full"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                    const selectedValue = e.target.value;
                                                    setFieldValue("province", selectedValue);
                                                    setSelectedProvince(selectedValue);
                                                    setFieldValue("city", "");
                                                }}
                                            >
                                                <option value="" disabled>Pilih Provinsi</option>
                                                {provincesLoading ? (
                                                    <option disabled>Loading...</option>
                                                ) : (
                                                    provinces?.map((province: any) => (
                                                        <option key={province.province_id} value={province.province_id}>
                                                            {province.province}
                                                        </option>
                                                    ))
                                                )}
                                            </Field>
                                            {touched.province && errors.province && (
                                                <div className="error text-red-600 text-xs">{errors.province}</div>
                                            )}
                                        </div>

                                        <div>
                                            <Field
                                                as="select"
                                                id="city"
                                                name="city"
                                                value={values.city}
                                                onChange={handleChange}
                                                disabled={!selectedProvince}
                                                className="border border-gray-400 rounded-md p-2 w-full"
                                            >
                                                <option value="">
                                                    {!selectedProvince ? "Silahkan Pilih Provinsi" : "Pilih Kota"}
                                                </option>
                                                {citiesLoading ? (
                                                    <option disabled>Loading...</option>
                                                ) : (
                                                    cities?.map((city: any) => (
                                                        <option key={city.city_id} value={city.city_name}>
                                                            {city.city_name}
                                                        </option>
                                                    ))
                                                )}
                                            </Field>
                                            {touched.city && errors.city && (
                                                <div className="error error text-red-600 text-xs">{errors.city}</div>
                                            )}
                                        </div>
                                        <TextField
                                            id="zipCode"
                                            label="Kode Pos"
                                            name="zipCode"
                                            value={values.zipCode}
                                            onChange={handleChange}
                                            size="small"
                                            fullWidth
                                            error={touched.zipCode && Boolean(errors.zipCode)}
                                            helperText={touched.zipCode && errors.zipCode}
                                        />


                                        <div className="mt-4 h-80 block md:hidden">
                                            <MapContainer id="map-container-mobile" key={time} center={isPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationPicker setFieldValue={setFieldValue} position={isPosition} setPosition={setIsPosition} />
                                            </MapContainer>
                                        </div>

                                        <ButtonCustom disabled={isPending} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                            Tambah Alamat
                                        </ButtonCustom>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </main>
                </section>
            </main>

            {/* web session */}
            <ContentWebSession caption="Tambah alamat">
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
                        validationSchema={Yup.object({
                            addressName: Yup.string().required("Nama Alamat harap diisi!"),
                            addressDetail: Yup.string().required("Alamat harap diisi!"),
                            province: Yup.string().required("Provinsi harap diisi!"),
                            city: Yup.string().required("Kota harap diisi!"),
                            zipCode: Yup.string().required("Kode Pos harap diisi!"),
                        })}

                        initialValues={getSingleUserAddress ?
                            {
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
                        {/* belum solved */} 
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
                                                cities?.map((city: any) => (
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
                                    <ButtonCustom disabled={isPending} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                        Tambah Alamat
                                    </ButtonCustom>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </ContentWebSession>
        </>
    );
}
