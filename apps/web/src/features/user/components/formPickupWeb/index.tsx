import { Formik, Field, Form, ErrorMessage } from 'formik';
import Link from 'next/link'
import { FaLocationDot } from "react-icons/fa6";
import ButtonCustom from '@/components/core/buttonCustom';
import { CiSquarePlus } from "react-icons/ci";
import { IPickupFormProps } from './type';


export const PickupFormWeb = ({ dataOrderType, dataOrderTypeLoading, dataNearestStoreLoading, setOpenDialog, dataMainAddressLoading, dataNearestStore, dataMainAddress, selectedAddress, handlePickupRequest, pickupValidationSchema, PendingPickupSubmit, isDisabledSucces }: IPickupFormProps) => (
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
                                    <div className="font-semibold text-gray-800 flex items-center gap-1"> <span className="text-orange-500"><FaLocationDot /></span>Alamat {dataMainAddress?.addressName} • {dataMainAddress?.User?.firstName} {dataMainAddress?.User?.lastName}</div>
                                    <p className="text-gray-600">{dataMainAddress?.addressDetail}</p>
                                    <p className="text-gray-600">{dataMainAddress?.city}, {dataMainAddress?.province}, {dataMainAddress?.zipCode}</p>
                                </div>
                            ) : !dataMainAddress ? (
                                <Link href='/user/dashboard/settings/address/c' className='flex items-center gap-2 justify-center'>
                                    <div className="flex w-full items-center gap-1 border border-gray-300 p-4 rounded-lg bg-white">
                                        <span><CiSquarePlus /></span><h1>Buat Alamat Baru</h1>
                                    </div>
                                </Link>
                            ) : (
                                <div onClick={() => setOpenDialog(true)} className='border border-gray-300 p-4 rounded-lg bg-white'>
                                    <p className="font-semibold text-gray-800 flex items-center gap-1"> <span className="text-orange-500"><FaLocationDot /></span>Alamat {dataMainAddress?.addressName} • {dataMainAddress?.User?.firstName} {dataMainAddress?.User?.lastName}</p>
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
                                        <div className="font-semibold text-gray-800 flex items-center gap-1"><span className="text-orange-500"><FaLocationDot /></span>Store Terdekat • {dataNearestStore[0]?.storeName}</div>
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
                            <Field as="select" disabled={!dataMainAddress} name="orderTypeId" className="w-full border border-gray-300 rounded-md p-2 bg-white hover:bg-gray-100"
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFieldValue('orderTypeId', e.target.value)}>
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
                                <h1 className="text-lg font-semibold text-gray-800">{values?.orderTypeId == '1' ? 'Layanan Mencuci' : values?.orderTypeId == '2' ? 'Layanan Setrika' : values?.orderTypeId == '3' ? 'Mencuci & Setrika' : 'Belum dipilih'}</h1>
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
)