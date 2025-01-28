import Link from "next/link";
import { IPaymentContent } from "./type";
import { FaWhatsapp } from "react-icons/fa6";
import Image from "next/image";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
export default function PaymentContentMobile(
    { order, imageLoading, setImageLoading, handlConfirmPaymentPending, handleConfirmPayment }: IPaymentContent
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">

            {order?.isPaid === false && (order?.paymentMethod as 'MIDTRANS' | 'TF_MANUAL') === 'TF_MANUAL' && order?.paymentProof ?

                <ConfirmAlert colorConfirmation="blue" caption="Apakah anda yakin ingin melakukan verifikasi pembayaran pada order berikut?" description={
                    <>
                        {imageLoading && 'Memuat Gambar...'}
                        <Image
                            src={`${order.paymentProof}`}
                            alt="payment proof"
                            width={500}
                            height={200}
                            onLoadingComplete={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                            className={`transition-opacity duration-300 ${imageLoading ? "opacity-0" : "opacity-100"
                                }`}
                        />
                    </>
                }
                    disabled={handlConfirmPaymentPending}
                    onClick={() => handleConfirmPayment(order?.id)}

                >
                    <div className="flex items-center">
                        <div className="px-2">
                            <h2 className="font-medium text-gray-900">
                                {order?.id}
                            </h2>
                            <h2 className="font-medium text-gray-900">
                                {order?.User?.firstName} {order?.User?.lastName}
                            </h2>
                            <div className="text-xs text-gray-500">
                                {order?.isPaid === false && (!order?.paymentMethod || order?.paymentMethod === 'MIDTRANS')
                                    ? 'Menunggu Pembayaran'
                                    : order?.isPaid === false && order?.paymentMethod === 'TF_MANUAL' && order?.paymentProof
                                        ? 'Menunggu Verifikasi Admin'
                                        : 'Terbayarkan'}
                            </div>
                            <p className="text-xs text-gray-500">
                                {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                            </p>
                        </div>
                    </div>
                </ConfirmAlert>
                :
                <div className="flex items-center">
                    <div className="px-2">
                        <h2 className="font-medium text-gray-900">
                            {order?.id}
                        </h2>
                        <h2 className="font-medium text-gray-900">
                            {order?.User?.firstName} {order?.User?.lastName}
                        </h2>
                        <div className="text-xs text-gray-500">
                            {order?.isPaid === false && (!order?.paymentMethod || order?.paymentMethod === 'MIDTRANS')
                                ? 'Menunggu Pembayaran'
                                : order?.isPaid === false && order?.paymentMethod === 'TF_MANUAL' && order?.paymentProof
                                    ? 'Menunggu Verifikasi Admin'
                                    : 'Terbayarkan'}
                        </div>
                        <p className="text-xs text-gray-500">
                            {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                        </p>
                    </div>
                </div>}
            <div className="flex gap-1">
                <Link href={`https://wa.me/${order?.User?.phoneNumber}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                    <FaWhatsapp />
                </Link>
            </div>
        </section>
    )
}