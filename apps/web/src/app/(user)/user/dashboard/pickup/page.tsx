'use client'

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import HeaderMobileUser from "@/components/core/headerMobileUser";
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
import ContentWebLayout from '@/components/core/webSessionContent';
import ButtonCustom from '@/components/core/button';
import Link from 'next/link'
import ContentMobileLayout from '@/components/core/mobileSessionLayout/mainMenuLayout';
import { MdSportsMotorsports } from 'react-icons/md';
import { FaLocationDot, FaPlus, FaTruck } from "react-icons/fa6";
import { pickupValidationSchema } from '@/features/user/schemas/pickupValidation';


export default function PickupLaundry() {
    const token = authStore((state) => state?.token);
    const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();


    const [userAddress, setUserAddress] = useState(params.get('address') || null);
    const { mutate: handlePickupRequest, isPending: PendingPickupSubmit } = useMutation({
        mutationFn: async ({ deliveryFee, outletId, orderTypeId, userAddressId }: IRequestPickup) => {
            return await instance.post(
                '/order/request-pickup',
                { deliveryFee, outletId, orderTypeId, userAddressId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    });

    const { data: dataOrderType, isLoading: dataOrderTypeLoading } = useQuery<IOrderType[]>({
        queryKey: ['get-order-type'],
        queryFn: async () => {
            const res = await instance.get('/order/type');
            return res?.data?.data;
        },
    });

    const { data: dataMainAddress, isLoading: dataMainAddressLoading } = useQuery({
        queryKey: ['get-main-address'],
        queryFn: async () => {
            const res = await instance.get('/user/main-address', {
                headers: { Authorization: `Bearer ${token}` }
            });
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
            <ContentMobileLayout title='Permintaan Pickup' icon={<FaTruck className='text-lg' />}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        deliveryFee: dataNearestStore && dataNearestStore[0] ? (Math.ceil(dataNearestStore[0]?.distance) * 8000) : 0,
                        outletId: dataNearestStore && dataNearestStore[0] ? dataNearestStore[0]?.id : '',
                        orderTypeId: '',
                        userAddressId: !selectedAddress ? dataMainAddress?.id : selectedAddress?.id,
                    }}
                    validationSchema={pickupValidationSchema}
                    onSubmit={(values, { resetForm }) => {
                        handlePickupRequest({
                            deliveryFee: values.deliveryFee,
                            outletId: values.outletId,
                            orderTypeId: values.orderTypeId,
                            userAddressId: values.userAddressId,
                        }, { onSuccess: () => { resetForm() } })
                    }}>
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form className='w-full h-full flex gap-4'>
                            <div className='w-full h-full flex flex-col justify-center space-y-2'>
                                <section className='w-full cursor-pointer'>
                                    {dataMainAddressLoading ? (
                                        <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                                            <span className="text-gray-500">Memuat alamat...</span>
                                        </div>
                                    ) : dataMainAddress && !selectedAddress ? (
                                        <div onClick={() => setOpenDialog(true)} className='border border-gray-300 p-4 rounded-lg bg-gray-50'>
                                            <div className="font-semibold text-gray-800 flex items-center gap-1"> <p className="text-orange-500"><FaLocationDot /></p>Alamat {dataMainAddress?.addressName} • {dataMainAddress?.User?.firstName} {dataMainAddress?.User?.lastName}</div>
                                            <p className="text-gray-600">{dataMainAddress?.addressDetail}</p>
                                            <p className="text-gray-600">{dataMainAddress?.city}, {dataMainAddress?.province}, {dataMainAddress?.zipCode}</p>
                                        </div>
                                    ) : !dataMainAddress ? (
                                        <Link href='/user/dashboard/settings/address/c' className='flex items-center gap-2 justify-center'>
                                            <div className="border border-gray-300 p-4 rounded-lg bg-white">
                                                <span><CiSquarePlus /></span><h1>Buat Alamat Baru</h1>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div onClick={() => setOpenDialog(true)} className='border border-gray-300 p-4 rounded-lg bg-gray-50'>
                                            <p className="font-semibold text-gray-800">{selectedAddress?.User?.firstName} {selectedAddress?.User?.lastName}</p>
                                            <p className="text-gray-600">{selectedAddress?.addressDetail}</p>
                                            <p className="text-gray-600">{selectedAddress?.city}, {selectedAddress?.province}, {selectedAddress?.zipCode}</p>
                                        </div>
                                    )}
                                </section>

                                <section className="w-full">
                                    <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                                        {dataNearestStoreLoading ? (
                                            <span className="text-gray-500">Memuat store terdekat...</span>
                                        ) : dataNearestStore && dataNearestStore.length > 0 ? (
                                            <div>
                                                <div className="font-semibold text-gray-800 flex items-center gap-1"><p className="text-orange-500"><FaLocationDot /></p>Store Terdekat • {dataNearestStore[0]?.storeName}</div>
                                                <p className="text-gray-600">{dataNearestStore[0]?.address} -{' '}
                                                    <span className='text-sm'>{(dataNearestStore[0]?.distance).toFixed(2)} km</span></p>
                                                <p className="text-gray-600"></p>
                                            </div>
                                        ) : (
                                            <span className="text-red-500">Tidak ada store di dekatmu. Nantikan kedatangan kami!</span>
                                        )}
                                    </div>
                                </section>

                                <section className="w-full pb-4">
                                    <Field as="select" name="orderTypeId" className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100"
                                        onChange={(e: any) => setFieldValue('orderTypeId', e.target.value)}>
                                        <option value="" disabled>-- Pilih Tipe Laundry --</option>
                                        {dataOrderTypeLoading ? (
                                            <option disabled>Memuat...</option>
                                        ) : (
                                            dataOrderType?.filter((item) => item?.id && item?.type).map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item?.type == 'Wash Only' ? 'Layanan Mencuci (Rp 6.500/kg)' : item?.type == 'Iron Only' ? 'Layanan Setrika (Rp 6.000/kg)' : 'Mencuci dan Setrika (Rp 9.000/kg)'}
                                                </option>
                                            ))
                                        )}
                                    </Field>
                                    <ErrorMessage name="orderTypeId" component="div" className="text-red-500 text-sm" />
                                </section>

                                <section className="w-full border-t pt-2">
                                    <h1 className='font-bold'>Detail Pemesanan:</h1>
                                    <div className='flex justify-between items-center pt-2 pb-1'>
                                        <h1>Tipe layanan</h1>
                                        <h1 className="text-lg font-semibold text-gray-800">{values?.orderTypeId == '1' ? 'Layanan Mencuci' : values?.orderTypeId == '2' ? 'Layanan Strika' : values?.orderTypeId == '3' ? 'Mencuci & Strika' : 'Belum dipilih'}</h1>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <h1>Ongkos pengiriman</h1>
                                        {dataNearestStore && dataNearestStore.length > 0 ? (
                                            <h1 className="text-lg font-semibold text-gray-800">
                                                {values?.orderTypeId ?
                                                    <span>Rp{(Math.ceil(dataNearestStore[0]?.distance) * 8000).toLocaleString('id-ID') || '0'}</span>
                                                    : '0'
                                                }
                                            </h1>
                                        ) : (
                                            <h1 className="text-gray-500">0</h1>
                                        )}
                                    </div>
                                </section>
                                <ButtonCustom type="submit" disabled={PendingPickupSubmit || isDisabledSucces || !values?.orderTypeId} width='w-full' btnColor='bg-orange-500 hover:bg-orange-500'>
                                    {PendingPickupSubmit ? 'Memproses...' : 'Kirim Permintaan Pickup'}
                                </ButtonCustom>
                            </div>
                        </Form>
                    )}
                </Formik>
            </ContentMobileLayout>
            <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
                <DialogTrigger className="hidden"></DialogTrigger>
                <DialogContent className="w-[90%] md:w-[60%] max-w-md">
                    <DialogHeader>
                        <DialogTitle>Pilih Alamat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2">
                        {dataAllAddressLoading ? (
                            <div className="border border-gray-300 p-4 rounded-lg bg-gray-50">
                                <span className="text-gray-500">Memuat alamat...</span>
                            </div>
                        ) : dataAllAddress && dataAllAddress.length > 0 ? (
                            dataAllAddress.map((address: IAddress) => (
                                <div
                                    key={address.id}
                                    className="border p-3 rounded-lg bg-gray-100 cursor-pointer hover:bg-gray-200"
                                    onClick={() => { handleAddressSelect(address), setUserAddress(address.id) }}
                                >
                                    <p className="font-semibold">{address?.addressName}</p>
                                    <p className="text-gray-600">{address?.addressDetail}</p>
                                    <p className="text-gray-600">{address?.city} {address?.province}</p>
                                </div>
                            ))
                        ) : (
                            <span className="text-gray-500">Tidak ada alamat tersedia.</span>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            <ContentWebLayout caption='Permintaan Pickup'>
                <div className='w-full h-full'>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            deliveryFee: dataNearestStore && dataNearestStore[0] ? (Math.ceil(dataNearestStore[0]?.distance) * 8000) : 0,
                            outletId: dataNearestStore && dataNearestStore[0] ? dataNearestStore[0]?.id : '',
                            orderTypeId: '',
                            userAddressId: !selectedAddress ? dataMainAddress?.id : selectedAddress?.id,
                        }}
                        validationSchema={pickupValidationSchema}
                        onSubmit={(values, { resetForm }) => {
                            handlePickupRequest({
                                deliveryFee: values.deliveryFee,
                                outletId: values.outletId,
                                orderTypeId: values.orderTypeId,
                                userAddressId: values.userAddressId,
                            }, { onSuccess: () => { resetForm() } })
                        }}>
                        {({ isSubmitting, setFieldValue, values }) => (
                            <Form className='w-full h-full flex gap-4'>
                                <div className='w-full h-full bg-gray-200 rounded-2xl p-3 flex flex-col justify-center space-y-2'>
                                    <section className='w-full cursor-pointer'>
                                        {dataMainAddressLoading ? (
                                            <div className="border border-gray-300 p-4 rounded-lg bg-white">
                                                <span className="text-gray-500">Memuat alamat...</span>
                                            </div>
                                        ) : dataMainAddress && !selectedAddress ? (
                                            <div onClick={() => setOpenDialog(true)} className='border border-gray-300 p-4 rounded-lg bg-white'>
                                                <div className="font-semibold text-gray-800 flex items-center gap-1"> <p className="text-orange-500"><FaLocationDot /></p>Alamat {dataMainAddress?.addressName} • {dataMainAddress?.User?.firstName} {dataMainAddress?.User?.lastName}</div>
                                                <p className="text-gray-600">{dataMainAddress?.addressDetail}</p>
                                                <p className="text-gray-600">{dataMainAddress?.city}, {dataMainAddress?.province}, {dataMainAddress?.zipCode}</p>
                                            </div>
                                        ) : !dataMainAddress ? (
                                            <Link href='/user/dashboard/settings/address/c' className='flex items-center gap-2 text-2xl justify-center border py-10 border-gray-300 text-neutral-500 p-4 rounded-lg bg-white w-full'>
                                                <span><FaPlus className='font-sans font-semibold' /></span><h1>Buat Alamat Baru</h1>
                                            </Link>
                                        ) : (
                                            <div onClick={() => setOpenDialog(true)} className='border border-gray-300 p-4 rounded-lg bg-white'>
                                                <p className="font-semibold text-gray-800 flex items-center gap-1"> <p className="text-orange-500"><FaLocationDot /></p>Alamat {dataMainAddress?.addressName} • {dataMainAddress?.User?.firstName} {dataMainAddress?.User?.lastName}</p>
                                                <p className="text-gray-600">{selectedAddress?.addressDetail}</p>
                                                <p className="text-gray-600">{selectedAddress?.city}, {selectedAddress?.province}, {selectedAddress?.zipCode}</p>
                                            </div>
                                        )}
                                    </section>

                                    <section className="w-full">
                                        <div className="border border-gray-300 p-4 rounded-lg bg-white">
                                            {dataNearestStoreLoading ? (
                                                <span className="text-gray-500">Memuat store terdekat...</span>
                                            ) : dataNearestStore && dataNearestStore.length > 0 ? (
                                                <div>
                                                    <div className="font-semibold text-gray-800 flex items-center gap-1"><p className="text-orange-500"><FaLocationDot /></p>Store Terdekat • {dataNearestStore[0]?.storeName}</div>
                                                    <p className="text-gray-600">{dataNearestStore[0]?.address} -{' '}
                                                        <span className='text-sm'>{(dataNearestStore[0]?.distance).toFixed(2)} km</span></p>
                                                    <p className="text-gray-600"></p>
                                                </div>
                                            ) : (
                                                <span className="text-red-500">Tidak ada store di dekatmu. Nantikan kedatangan kami!</span>
                                            )}
                                        </div>
                                    </section>

                                    <section className="w-full pb-4">
                                        <Field as="select" disabled={!dataMainAddress} name="orderTypeId" className="w-full border border-gray-300 rounded-md p-2 bg-gray-50 hover:bg-gray-100"
                                            onChange={(e: any) => setFieldValue('orderTypeId', e.target.value)}>
                                            <option value="" disabled>-- Pilih Tipe Laundry --</option>
                                            {dataOrderTypeLoading ? (
                                                <option disabled>Memuat...</option>
                                            ) : (
                                                dataOrderType?.filter((item) => item?.id && item?.type).map((item) => (
                                                    <option key={item.id} value={item.id}>
                                                        {item?.type == 'Wash Only' ? 'Layanan Mencuci (Rp 6.500/kg)' : item?.type == 'Iron Only' ? 'Layanan Setrika (Rp 6.000/kg)' : 'Mencuci dan Setrika (Rp 9.000/kg)'}
                                                    </option>
                                                ))
                                            )}
                                        </Field>
                                        <ErrorMessage name="orderTypeId" component="div" className="text-red-500 text-sm" />
                                    </section>

                                    <section className="w-full border-t pt-2">
                                        <h1 className='font-bold'>Detail Pemesanan:</h1>
                                        <div className='flex justify-between items-center pt-2 pb-1'>
                                            <h1>Tipe layanan</h1>
                                            <h1 className="text-lg font-semibold text-gray-800">{values?.orderTypeId == '1' ? 'Layanan Mencuci' : values?.orderTypeId == '2' ? 'Layanan Strika' : values?.orderTypeId == '3' ? 'Mencuci & Strika' : 'Belum dipilih'}</h1>
                                        </div>
                                        <div className='flex justify-between items-center'>
                                            <h1>Ongkos pengiriman</h1>
                                            {dataNearestStore && dataNearestStore.length > 0 ? (
                                                <h1 className="text-lg font-semibold text-gray-800">
                                                    {values?.orderTypeId ?
                                                        <span>Rp{(Math.ceil(dataNearestStore[0]?.distance) * 8000).toLocaleString('id-ID') || '0'}</span>
                                                        : '0'
                                                    }
                                                </h1>
                                            ) : (
                                                <h1 className="text-gray-500">Estimasi tidak tersedia.</h1>
                                            )}
                                        </div>
                                    </section>
                                </div>

                                <div className="w-full h-full bg-blue-700 flex rounded-2xl p-6">
                                    <div className="flex flex-col justify-center items-start">
                                        <h1 className="text-4xl font-semibold text-white mb-4">Layanan Pickup Cepat dan Mudah</h1>
                                        <p className="text-neutral-200 mb-6">
                                            Hemat waktu Anda dengan menggunakan layanan pickup kami. Cukup pilih alamat dan
                                            kami akan menjemput barang Anda tanpa repot. Nikmati kenyamanan dengan layanan terpercaya.
                                        </p>
                                        <ButtonCustom type="submit" disabled={PendingPickupSubmit || isDisabledSucces || !values?.orderTypeId} width='w-full' btnColor='bg-orange-500 hover:bg-orange-500'>
                                            {PendingPickupSubmit ? 'Memproses...' : 'Kirim Permintaan Pickup'}
                                        </ButtonCustom>
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </ContentWebLayout >
        </>
    );
}
