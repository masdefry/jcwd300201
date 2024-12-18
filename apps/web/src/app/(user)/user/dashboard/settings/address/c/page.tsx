'use client'
import HeaderMobileUser from "@/components/core/headerMobileUser";
import Link from "next/link"
import { FaArrowLeft } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import ButtonCustom from "@/components/core/button";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useToast } from "@/components/hooks/use-toast";
import { instance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { IAddressDetail } from "./types";
import { useQuery } from "@tanstack/react-query";
import authStore from "@/zustand/authstore";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import ContentWebSession from "@/components/core/webSessionContent";

interface AddressFormValues {
    addressName: string
    addressDetail: string
    province: string
    city: string
    zipCode: string
    latitude: string
    longitude: string
}

interface IPosition {
    lat: number;
    lng: number;
}

const customMarkerIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});


function LocationPicker({
    setFieldValue,
    position,
    setPosition,
}: {
    setFieldValue: any;
    position: IPosition;
    setPosition: React.Dispatch<React.SetStateAction<IPosition>>;
}) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setFieldValue("latitude", lat);
            setFieldValue("longitude", lng);
            setPosition({ lat, lng });
        },
    });

    return position ? (
        <Marker
            position={position}
            icon={customMarkerIcon}
            draggable={true}
            eventHandlers={{
                dragend(e) {
                    const lat = e.target.getLatLng().lat;
                    const lng = e.target.getLatLng().lng;
                    setFieldValue("latitude", lat);
                    setFieldValue("longitude", lng);
                    setPosition({ lat, lng });
                },
            }}
        />
    ) : null;
}

export default function AddAddress() {
    const token = authStore((state) => state.token)
    const { toast } = useToast()
    const [position, setPosition] = useState({ lat: -6.200000, lng: 106.816666 });

    const getCurrentLocation = (setFieldValue: any) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition({ lat: latitude, lng: longitude });
                    setFieldValue("latitude", latitude);
                    setFieldValue("longitude", longitude);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };


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

    const [selectedProvince, setSelectedProvince] = useState<string | null>("");
    console.log(selectedProvince)
    
    const { data: provinces, isLoading: provincesLoading } = useQuery({
        queryKey: ['get-province'],
        queryFn: async () => {
            const res = await instance.get('/order/province');
            return res?.data?.data?.rajaongkir?.results
        },
    });
    const { data: cities, isLoading: citiesLoading } = useQuery({
        queryKey: ['get-city', selectedProvince],
        queryFn: async () => {
            const res = await instance.get('/order/city', { params: { province_id: selectedProvince } });
            console.log(res)
            return res?.data?.data?.rajaongkir?.results;
        },
        enabled: !!selectedProvince,
    });
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
                                latitude: Yup.string().required("titik lokasi harap diisi!"),
                                longitude: Yup.string().required("titik lokasi harap diisi!"),
                            })}
                            onSubmit={(values) => {
                                addUserAddress({
                                    addressName: values.addressName,
                                    addressDetail: values.addressDetail,
                                    province: values.province,
                                    city: values.city,
                                    zipCode: values.zipCode,
                                    latitude: values.latitude,
                                    longitude: values.longitude
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
                                                <option value="">Pilih Provinsi</option>
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


                                        <div className="mt-4 h-80">
                                            <MapContainer
                                                center={position}
                                                zoom={13}
                                                style={{ height: "100%", width: "100%" }}
                                            >
                                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                                <LocationPicker setFieldValue={setFieldValue} position={position} setPosition={setPosition} />
                                            </MapContainer>
                                        </div>

                                        <button
                                            className="w-full text-white rounded-lg bg-orange-500 py-2 hover:bg-orange-600"
                                            onClick={() => getCurrentLocation(setFieldValue)}
                                            type="button"
                                        >
                                            Use Current Location
                                        </button>

                                        <TextField
                                            id="latitude"
                                            label=""
                                            name="latitude"
                                            value={values.latitude}
                                            disabled
                                            size="small"
                                            fullWidth
                                        />

                                        <TextField
                                            id="longitude"
                                            label=""
                                            name="longitude"
                                            value={values.longitude}
                                            disabled
                                            size="small"
                                            fullWidth
                                        />

                                        <ButtonCustom
                                            width="w-full"
                                            btnColor="bg-orange-500 hover:bg-orange-600"
                                            txtColor="text-white"
                                            type="submit"
                                        >
                                            Tambah Alamat
                                        </ButtonCustom>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </main>
                </section>
            </main>

            <ContentWebSession caption="Tambah Alamat">
                <h1>gas</h1>
            </ContentWebSession>
        </>
    )
}
