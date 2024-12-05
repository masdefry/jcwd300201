'use client'
import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import ButtonCustom from "@/components/core/button";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FormControl } from "@mui/material";
import { FormikHelpers } from "formik";

interface StoreFormValues {
    storeName: string
    address: string
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

// function LocationPicker({ setFieldValue, position }) {
//     console.log(position)
//     return position === null ? null : <Marker position={position} icon={customMarkerIcon} />;
// }

function LocationPicker({
    setFieldValue,
    position,
    setPosition, // Add setPosition as a prop
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
            setPosition({ lat, lng }); // Update position state using setPosition
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
                    setPosition({ lat, lng }); // Update position state using setPosition
                },
            }}
        />
    ) : null;
}

export default function editStore() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit"> 
                    <HeaderMobile />
                    <main className="mx-8">
                        <section className="flex gap-2 items-center bg-white w-full z-50 font-bold  fixed pt-2 mt-14 text-lg border-b-2 pb-4">
                            <Link href='/admin/settings'><FaArrowLeft /></Link> EDIT OUTLET
                        </section>
                        <Formik
                            initialValues={{
                                storeName: "",
                                address: "",
                                province: "",
                                city: "",
                                zipCode: "",
                                latitude: "",
                                longitude: "",
                            }}
                            validationSchema={Yup.object({
                                storeName: Yup.string().required("Nama Toko is required"),
                                address: Yup.string().required("Alamat is required"),
                                province: Yup.string().required("Provinsi is required"),
                                city: Yup.string().required("Kota is required"),
                                zipCode: Yup.string().required("Kode Pos is required"),
                            })}
                            onSubmit={(values) => {
                                console.log("Form Values:", values);
                            }}
                        >
                            {({ values, setFieldValue, handleChange, errors, touched }) => (
                                <Form>
                                    <div className="py-36 flex gap-4 flex-wrap justify-center flex-col ">

                                        <TextField
                                            id="storeName"
                                            name="storeName"
                                            label="Nama Toko"
                                            value={values.storeName}
                                            onChange={handleChange}
                                            placeholder="CnC - Jakarta "
                                            size="small"
                                            fullWidth
                                            error={touched.storeName && Boolean(errors.storeName)}
                                            helperText={touched.storeName && errors.storeName}
                                        />
                                        <TextField
                                            id="address"
                                            name="address"
                                            label="Alamat"
                                            value={values.address}
                                            onChange={handleChange}
                                            placeholder="Jl. Rancak Banai no.76"
                                            size="small"
                                            fullWidth
                                            error={touched.address && Boolean(errors.address)}
                                            helperText={touched.address && errors.address}
                                        />
                                        <TextField
                                            id="province"
                                            name="province"
                                            label="Provinsi"
                                            value={values.province}
                                            onChange={handleChange}
                                            placeholder="Banten"
                                            size="small"
                                            fullWidth
                                            error={touched.province && Boolean(errors.province)}
                                            helperText={touched.province && errors.province}
                                        />
                                        <TextField
                                            id="city"
                                            name="city"
                                            label="Kota"
                                            value={values.city}
                                            onChange={handleChange}
                                            placeholder="Tangerang"
                                            size="small"
                                            fullWidth
                                            error={touched.city && Boolean(errors.city)}
                                            helperText={touched.city && errors.city}
                                        />
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

                                        <button
                                            className="w-full text-white bg-green-500 py- hover:bg-green-600"
                                            onClick={() => getCurrentLocation(setFieldValue)}
                                            type="button"
                                        >
                                            Use Current Location
                                        </button>

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

                                        <TextField
                                            id="latitude"
                                            label="Latitude"
                                            name="latitude"
                                            value={values.latitude}
                                            disabled
                                            size="small"
                                            fullWidth
                                        />

                                        <TextField
                                            id="longitude"
                                            label="Longitude"
                                            name="longitude"
                                            value={values.longitude}
                                            disabled
                                            size="small"
                                            fullWidth
                                        />

                                        <ButtonCustom
                                            width="w-full"
                                            btnColor="bg-sky-500 hover:bg-sky-600"
                                            txtColor="text-white"
                                            type="submit"
                                        >
                                            Ubah
                                        </ButtonCustom>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </main>
                </section>
            </main>
        </>
    )
}
