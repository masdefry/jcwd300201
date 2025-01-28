import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { IDeliveryContent } from "./type";
import { IoLocationSharp } from "react-icons/io5";

export default function DeliveryContentMobile(
    { order,
        handleProcessDelivery,
        handleAcceptOrderDelivery,
        handleProcessDeliveryPending,
        handleAcceptOrderDeliveryPending }: IDeliveryContent
) {
    return (
        <section
            key={order.id}
            className="flex justify-between items-center border-b py-4"
        >
            {order?.orderStatus[0]?.status !== 'DRIVER_DELIVERED_LAUNDRY' ? (
                < ConfirmAlert
                    colorConfirmation="blue"
                    caption={
                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                            ? 'Apakah Anda ingin melakukan pengiriman untuk pesanan ini?'
                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                'Apakah Anda ingin menyelesaikan pengiriman untuk pesanan ini?'
                                : ''
                    }
                    description={
                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                            ? 'Pastikan anda memilih order yang tepat/benar'
                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                'Pastikan anda memilih order yang tepat/benar'
                                : ''
                    }
                    onClick={
                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                            ? () => handleProcessDelivery(order?.id)
                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                () => handleAcceptOrderDelivery(order?.id)
                                : () => { }
                    }
                    disabled={
                        (order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true && handleProcessDeliveryPending)
                            || (order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && handleAcceptOrderDeliveryPending)
                            ? true
                            : false
                    }
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
                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                    ? 'Menunggu Pembayaran' :
                                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                        ? 'Siap untuk diantar' :
                                        order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                            ? 'Proses Pengantaran' :
                                            order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true
                                                ? 'Laundry berhasil diantar'
                                                : ''}
                            </div>
                            <p className="text-xs text-gray-500">
                                {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                            </p>
                        </div>
                    </div>
                </ConfirmAlert>
            ) : (

                <div className="flex items-center">
                    <div className="px-2">
                        <h2 className="font-medium text-gray-900">
                            {order?.id}
                        </h2>
                        <h2 className="font-medium text-gray-900">
                            {order?.User?.firstName} {order?.User?.lastName}
                        </h2>
                        <div className="text-xs text-gray-500">
                            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                ? 'Menunggu Pembayaran' :
                                order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                    ? 'Siap untuk dikirim' :
                                    order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                        ? 'Proses Pengiriman' :
                                        order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true
                                            ? 'Laundry berhasil diantar'
                                            : ''
                            }
                        </div>
                        <div className="text-xs text-gray-500">
                            {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-1">
                <Link href={`https://www.google.com/maps/search/?api=1&query=${order?.UserAddress?.latitude},${order?.UserAddress?.longitude}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                    <IoLocationSharp />
                </Link>

                <Link href={`https://wa.me/${order?.User?.phoneNumber}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                    <FaWhatsapp />
                </Link>
            </div>
        </section>
    )
}