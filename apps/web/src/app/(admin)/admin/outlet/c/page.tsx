'use client'
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createOutletValidationSchema } from "@/features/superAdmin/schemas/createOutletValidationSchema";
import { MapContainer, TileLayer, } from "react-leaflet";
import LocationPicker from "@/components/core/LocationPicker";
import ButtonCustom from "@/components/core/Button";

import "leaflet/dist/leaflet.css";
import ContentWebLayout from "@/components/core/WebSessionContent";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout";
import { useCreateOutletHook } from "@/features/superAdmin/hooks/useCreateOutletHook";

export default function CreateOutlet() {
    const {
        lngGlobal, token, time, isPosition, setIsPosition, selectedProvince, setSelectedProvince, dataUser, setDataUser,
        cities, citiesLoading, provinces, provincesLoading, handleSubmitAddStore, isPending,
    } = useCreateOutletHook()

    return (
        <>
            <MobileSessionLayout title='Tambah Outlet Baru'>
                <div className='w-full h-full flex'>
                    <Formik
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            handleSubmitAddStore({
                                storeName: values?.storeName,
                                address: values?.address,
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
                        validationSchema={createOutletValidationSchema}
                        initialValues={{
                            storeName: "",
                            address: "",
                            province: "",
                            city: "",
                            zipCode: "",
                            latitude: isPosition?.lat,
                            longitude: isPosition?.lng,
                        }}
                    >
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
                                        <label htmlFor="storeName" className="font-semibold">Nama Outlet <span className="text-red-600">*</span></label>
                                        <Field type='text' name='storeName' placeholder='CNC - Example 220' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                        <ErrorMessage component='div' name="storeName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                    </div>
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="address" className="font-semibold">Alamat Lengkap <span className="text-red-600">*</span></label>
                                        <Field type='text' name='address' placeholder='Masukan alamat lengkap anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
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
                                    <ButtonCustom disabled={isPending || !values?.address || !values?.city || !values?.zipCode || !values?.province || !values?.storeName} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                        {isPending ? 'Memproses..' : 'Tambah Alamat'}
                                    </ButtonCustom>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Tambah Outlet Baru">
                <div className='w-full h-full flex'>
                    <Formik
                        onSubmit={(values, { setSubmitting, resetForm }) => {
                            handleSubmitAddStore({
                                storeName: values?.storeName,
                                address: values?.address,
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
                        validationSchema={createOutletValidationSchema}
                        initialValues={{
                            storeName: "",
                            address: "",
                            province: "",
                            city: "",
                            zipCode: "",
                            latitude: isPosition?.lat,
                            longitude: isPosition?.lng,
                        }}
                    >
                        {({ setFieldValue, values, handleChange }) => (
                            <Form className="gap-5 h-full w-full justify-center">
                                <div className="h-44 mb-3 w-full relative">
                                    <MapContainer id="map-container-mobile" key={time} center={isPosition} zoom={13} className="w-full h-44 mb-3 rounded-2xl">
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationPicker setFieldValue={setFieldValue} position={isPosition} setPosition={setIsPosition} />
                                    </MapContainer>
                                </div>
                                <div className="flex flex-col pr-2 justify-center gap-4 w-full h-full overflow-y-auto">
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="storeName" className="font-semibold">Nama Outlet <span className="text-red-600">*</span></label>
                                        <Field type='text' name='storeName' placeholder='CNC - Example 220' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
                                        <ErrorMessage component='div' name="storeName" className="bg-white text-red-600 absolute right-2 top-1 text-sm" />
                                    </div>
                                    <div className="w-full flex flex-col gap-2 relative">
                                        <label htmlFor="address" className="font-semibold">Alamat Lengkap <span className="text-red-600">*</span></label>
                                        <Field type='text' name='address' placeholder='Masukan alamat lengkap anda' className='w-full py-2 text-sm px-3 focus:outline-none border focus:border-orange-500' />
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
                                    <ButtonCustom disabled={isPending || !values?.address || !values?.city || !values?.zipCode || !values?.province || !values?.storeName} width="w-full" btnColor="bg-orange-500 hover:bg-orange-600" txtColor="text-white" type="submit">
                                        Tambah Alamat
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