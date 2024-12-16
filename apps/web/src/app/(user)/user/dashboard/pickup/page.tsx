'use client'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import HeaderMobileUser from "@/components/core/headerMobileUser";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { IAddress, IOrderType, IRequestPickup } from './type';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/components/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { CiSquarePlus } from "react-icons/ci";
import ContentWebSession from '@/components/core/webSessionContent';

const validationSchema = Yup.object({
    deliveryFee: Yup.number().required().positive().integer(),
    storesId: Yup.string().required(),
    orderTypeId: Yup.string().required('Silahkan pilih tipe laundry'),
    userAddressId: Yup.string().required(),
});

export default function PickupLaundry() {
    const token = authStore((state) => state.token);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const [userAddress, setUserAddress] = useState(params.get('address') || null);

    const { mutate: handlePickupRequest } = useMutation({
        mutationFn: async ({ deliveryFee, storesId, orderTypeId, userAddressId }: IRequestPickup) => {
            return await instance.post(
                '/order/request-pickup',
                { deliveryFee, storesId, orderTypeId, userAddressId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            });
            console.log(res);
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            });
            console.log(err);
        }
    });

    const { data: dataOrderType, isLoading: dataOrderTypeLoading } = useQuery<IOrderType[]>({
        queryKey: ['get-order-type'],
        queryFn: async () => {
            const res = await instance.get('/order/type');
            console.log(res, 'ordertype');
            return res?.data?.data;
        },
    });

    const { data: dataMainAddress, isLoading: dataMainAddressLoading } = useQuery({
        queryKey: ['get-main-address'],
        queryFn: async () => {
            const res = await instance.get('/user/main-address', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res, 'mainaddress');
            return res?.data?.data;
        },
        retry: 4,

    });

    const { data: dataAllAddress, isLoading: dataAllAddressLoading } = useQuery({
        queryKey: ['get-all-address'],
        queryFn: async () => {
            const res = await instance.get('/user/all-address', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res, 'alladdress');
            return res?.data?.data;
        },
        retry: 4,
    });

    const { data: dataNearestStore, refetch, isLoading: dataNearestStoreLoading } = useQuery({
        queryKey: ['get-nearest-store'],
        queryFn: async () => {
            const res = await instance.get('/order/nearest-store', {
                params: {
                    address: userAddress,
                },
                headers: { Authorization: `Bearer ${token}` },
            });
            return res?.data?.data;
        },
    });

    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleAddressSelect = (address: IAddress) => {
        setSelectedAddress(address);
        setOpenDialog(false);
    };

    useEffect(() => {
        const currentUrl = new URLSearchParams(window.location.search); //
        if (userAddress) {
            currentUrl.set('address', userAddress);
        } else {
            currentUrl.delete('address');
        }
        router.push(`${pathname}?${currentUrl.toString()}`);
        refetch()
    }, [userAddress, refetch, pathname]);

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit max-w-[425px] md:max-w-full md:w-full block md:hidden">
                    <HeaderMobileUser />
                    <main className="mx-8">
                        <section className="bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                            REQUEST PICK UP LAUNDRY
                        </section>
                        <section className="space-y-3 pt-32">
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    deliveryFee: dataNearestStore && dataNearestStore[0] ? (Math.ceil(dataNearestStore[0]?.distance) * 8000) : 0,
                                    storesId: dataNearestStore && dataNearestStore[0] ? dataNearestStore[0]?.id : '',
                                    orderTypeId: '',
                                    userAddressId: !selectedAddress ? dataMainAddress?.id : selectedAddress?.id,
                                }}
                                validationSchema={validationSchema}
                                onSubmit={async (values) => {
                                    console.log(values);
                                    handlePickupRequest({
                                        deliveryFee: values.deliveryFee,
                                        storesId: values.storesId,
                                        orderTypeId: values.orderTypeId,
                                        userAddressId: values.userAddressId,
                                    });
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form>
                                        <section className="bg-white rounded-lg shadow-md p-4">
                                            <h2 className="font-bold text-center text-gray-700">Alamat</h2>
                                            <div
                                                className="border border-gray-300 rounded-lg p-4 text-center mt-2 bg-gray-50 cursor-pointer"

                                            >
                                                {dataMainAddressLoading ? (
                                                    <span className="text-gray-500">Memuat alamat...</span>
                                                ) : dataMainAddress && !selectedAddress ? (
                                                    <div onClick={() => setOpenDialog(true)}>
                                                        <p className="font-semibold text-gray-800">{dataMainAddress.addressName}</p>
                                                        <p className="text-gray-600">{dataMainAddress.addressDetail}</p>
                                                        <p className="text-gray-600">{dataMainAddress.city} {dataMainAddress.province}</p>
                                                    </div>
                                                ) : !dataMainAddress ? (
                                                    <div className='flex items-center justify-center'>
                                                        <div><CiSquarePlus /></div>
                                                        <div>Buat Alamat Baru</div>
                                                    </div>
                                                ) : (
                                                    <div onClick={() => setOpenDialog(true)}>
                                                        <p className="font-semibold text-gray-800">{selectedAddress?.addressName}</p>
                                                        <p className="text-gray-600">{selectedAddress?.addressDetail}</p>
                                                        <p className="text-gray-600">{selectedAddress?.city} {selectedAddress?.province}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        <section className="bg-white rounded-lg shadow-md p-4">
                                            <h2 className="font-bold text-center text-gray-700">Store Terdekat</h2>
                                            <div className="border border-gray-300 rounded-lg p-4 text-center mt-2 bg-gray-50">
                                                {dataNearestStoreLoading ? (
                                                    <span className="text-gray-500">Memuat store terdekat...</span>
                                                ) : dataNearestStore && dataNearestStore.length > 0 ? (
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{dataNearestStore[0]?.storeName}</p>
                                                        <p className="text-gray-600">{dataNearestStore[0]?.address}</p>
                                                        <p className="text-gray-600">Jarak: {dataNearestStore[0]?.distance.toFixed(2)} km</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-red-500">Tidak ada store di dekatmu. Nantikan kedatangan kami!</span>
                                                )}
                                            </div>
                                        </section>

                                        <section className="bg-white rounded-lg shadow-md p-4">
                                            <h2 className="font-bold text-center text-gray-700">Estimasi Ongkos Kirim</h2>
                                            <div className="border border-gray-300 rounded-lg p-4 text-center mt-2 bg-gray-50">
                                                {dataNearestStore && dataNearestStore.length > 0 ? (
                                                    <span className="text-lg font-semibold text-gray-800">
                                                        Rp{(Math.ceil(dataNearestStore[0]?.distance) * 8000).toLocaleString('id-ID')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">Estimasi tidak tersedia.</span>
                                                )}
                                            </div>
                                        </section>

                                        <section className="bg-white rounded-lg shadow-md p-4">
                                            <h2 className="font-bold text-center text-gray-700">Tipe Laundry</h2>
                                            <Field as="select" name="orderTypeId" className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100">
                                                <option value="">Pilih Tipe Laundry</option>
                                                {dataOrderTypeLoading ? (
                                                    <option disabled>Memuat...</option>
                                                ) : (
                                                    dataOrderType?.filter((item) => item?.id && item?.Type).map((item) => (
                                                        <option key={item.id} value={item.id}>
                                                            {item.Type}
                                                        </option>
                                                    ))
                                                )}
                                            </Field>
                                            <ErrorMessage name="orderTypeId" component="div" className="text-red-500 text-sm" />
                                        </section>

                                        <section className="mt-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg disabled:bg-gray-300"
                                            >
                                                {isSubmitting ? 'Memproses...' : 'Kirim Permintaan Pickup'}
                                            </button>
                                        </section>
                                    </Form>
                                )}
                            </Formik>
                        </section>
                    </main >
                </section >

                <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
                    <DialogTrigger className="hidden"></DialogTrigger>
                    <DialogContent className="w-[90%] md:w-[60%] max-w-md">
                        <DialogHeader>
                            <DialogTitle>Pilih Alamat</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            {dataAllAddressLoading ? (
                                <span>Memuat alamat...</span>
                            ) : dataAllAddress && dataAllAddress.length > 0 ? (
                                dataAllAddress.map((address: IAddress) => (
                                    <div
                                        key={address.id}
                                        className="border p-3 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                                        onClick={() => { handleAddressSelect(address), setUserAddress(address.id) }}
                                    >
                                        <p className="font-semibold">{address.addressName}</p>
                                        <p className="text-gray-600">{address.addressDetail}</p>
                                        <p className="text-gray-600">{address.city} {address.province}</p>
                                    </div>
                                ))
                            ) : (
                                <span className="text-gray-500">Tidak ada alamat tersedia.</span>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </main>

            <ContentWebSession caption='Permintaan Pesanan'>
                <h1>Pickup Request</h1>
            </ContentWebSession>
        </>
    );
}
