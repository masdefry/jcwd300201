'use client'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import HeaderMobileUser from "@/components/core/headerMobileUser";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import axios from "axios";

const validationSchema = Yup.object({
    deliveryFee: Yup.number().required('Estimasi Ongkos Kirim is required').positive('Must be positive').integer('Must be an integer'),
    storesId: Yup.string().required('Store ID is required'),
    orderTypeId: Yup.string().required('Order type is required'),
    userAddressId: Yup.string().required('User address is required'),
});

export default function PickupLaundry() {
    const token = authStore((state) => state.token)



    const { data: getOrderType, isLoading: getOrderTypeLoading } = useQuery({
        queryKey: ['get-order-type'],
        queryFn: async () => {
            const res = await instance.get('/order/type');
            console.log(res, 'ordertype')
            return res?.data?.data;
        },
    });

    const { data: getMainAddress, isLoading: getMainAddressLoading } = useQuery({
        queryKey: ['get-main-address'],
        queryFn: async () => {
            const res = await instance.get('/user/main-address', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { data: getNearestStore, isLoading: getNearestStoreLoading } = useQuery({
        queryKey: ['get-nearest-store'],
        queryFn: async () => {
            const res = await instance.get('/order/nearest-store', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });
    if (getNearestStore == undefined) return <div></div>
    if (getMainAddress == undefined) return <div></div>

    return (
        <main className="w-full h-fit">
            <section className="w-full h-fit max-w-[425px] md:max-w-full md:w-full block md:hidden">
                <HeaderMobileUser />
                <main className="mx-8">
                    <section className="bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                        REQUEST PICK UP LAUNDRY
                    </section>
                    <section className="space-y-3 pt-32">
                        <Formik
                            initialValues={{
                                deliveryFee: getNearestStore && getNearestStore[0] ? (Math.ceil(getNearestStore[0]?.distance) * 8000) : 0,
                                storesId: getNearestStore && getNearestStore[0] ? getNearestStore[0]?.id : '',
                                orderTypeId: '', 
                                userAddressId: getMainAddress ? getMainAddress.id : '',
                            }}
                            onSubmit={async (values) => {
                                console.log(values);
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <section className="bg-white rounded-lg shadow-md p-4">
                                        <h2 className="font-bold text-center text-gray-700">Alamat</h2>
                                        <div className="border border-gray-300 rounded-lg p-4 text-center mt-2 bg-gray-50">
                                            {getMainAddressLoading ? (
                                                <span className="text-gray-500">Memuat alamat...</span>
                                            ) : getMainAddress ? (
                                                <div>
                                                    <p className="font-semibold text-gray-800">{getMainAddress.addressName}</p>
                                                    <p className="text-gray-600">{getMainAddress.addressDetail}</p>
                                                    <p className="text-gray-600">{getMainAddress.city}, {getMainAddress.province}</p>
                                                </div>
                                            ) : (
                                                <span className="text-red-500">Tidak ada alamat utama. Klik untuk mengatur alamat.</span>
                                            )}
                                        </div>
                                    </section>

                                    {/* Nearest Store Section */}
                                    <section className="bg-white rounded-lg shadow-md p-4">
                                        <h2 className="font-bold text-center text-gray-700">Store Terdekat</h2>
                                        <div className="border border-gray-300 rounded-lg p-4 text-center mt-2 bg-gray-50">
                                            {getNearestStoreLoading ? (
                                                <span className="text-gray-500">Memuat store terdekat...</span>
                                            ) : getNearestStore && getNearestStore.length > 0 ? (
                                                <div>
                                                    <p className="font-semibold text-gray-800">{getNearestStore[0]?.storeName}</p>
                                                    <p className="text-gray-600">{getNearestStore[0]?.address}</p>
                                                    <p className="text-gray-600">Jarak: {getNearestStore[0]?.distance.toFixed(2)} km</p>
                                                </div>
                                            ) : (
                                                <span className="text-red-500">Tidak ada store di dekatmu. Nantikan kedatangan kami!</span>
                                            )}
                                        </div>
                                    </section>

                                    {/* Shipping Estimate Section */}
                                    <section className="bg-white rounded-lg shadow-md p-4">
                                        <h2 className="font-bold text-center text-gray-700">Estimasi Ongkos Kirim</h2>
                                        <div className="border border-gray-300 rounded-lg p-4 text-center mt-2 bg-gray-50">
                                            {getNearestStore && getNearestStore.length > 0 ? (
                                                <span className="text-lg font-semibold text-gray-800">
                                                    Rp{(Math.ceil(getNearestStore[0]?.distance) * 8000).toLocaleString('id-ID')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">Estimasi tidak tersedia.</span>
                                            )}
                                        </div>
                                    </section>

                                    {/* Laundry Type Section */}
                                    <section className="bg-white rounded-lg shadow-md p-4">
                                        <h2 className="font-bold text-center text-gray-700">Tipe Laundry</h2>
                                        <Field as="select" name="orderTypeId" className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100">
                                            <option value="">Pilih Tipe Laundry</option>
                                            {getOrderTypeLoading ? (
                                                <option disabled>Memuat...</option>
                                            ) : (
                                                getOrderType?.filter((item) => item?.id && item?.Type).map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item.Type}
                                                    </option>
                                                ))
                                            )}
                                        </Field>
                                        <ErrorMessage name="orderTypeId" component="div" className="text-red-500 text-sm mt-1" />
                                    </section>

                                    {/* Submit Section */}
                                    <section className="bg-white rounded-lg shadow-md p-4 flex justify-center">
                                        <button
                                            type="submit"
                                            className="w-full max-w-xs bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Proses Pickup...' : 'Request Pickup'}
                                        </button>
                                    </section>
                                </Form>
                            )}
                        </Formik>
                    </section>
                </main>
            </section>
        </main>
    )
}