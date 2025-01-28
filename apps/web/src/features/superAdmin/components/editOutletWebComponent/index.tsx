import { ErrorMessage, Field, Form, Formik } from "formik";
import ButtonCustom from "@/components/core/buttonCustom";
import { IEditOutletWeb } from "./type";
import { updateOutletValidationSchema } from "../../schemas/updateOutletValidationSchema";


export default function EditOutletWeb({
    isPosition,
    provinces,
    cities,
    provincesLoading,
    citiesLoading,
    dataOutlet,
    setSelectedProvince,
    isPositionCheck,
    selectedProvince,
    isDisabledSucces,
    isPending,
    router,
    handleUpdateOutlet
}: IEditOutletWeb) {
    return (
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
                    latitude: values?.latitude !== null ? values?.latitude.toString() : '',
                    longitude: values?.longitude !== null ? values?.longitude.toString() : ''
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
    )
}