import Link from "next/link";
import { IDeliveryContent } from "./type";
import { FaWhatsapp } from "react-icons/fa6";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";

export default function DeliveryContentMobile(
    { order, handleRequestDelivery }: IDeliveryContent
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true ? (
                <ConfirmAlert colorConfirmation="blue" caption={order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                    ? 'Apakah Anda ingin request pengiriman untuk pesanan ini?'
                    : ''}
                    description={order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                        ? 'Pastikan anda memilih order yang tepat/benar'
                        : ''} onClick={() => { handleRequestDelivery(order?.id) }}>
                    <div className="flex items-center">
                        <div className="px-2">
                            <h2 className="font-medium text-gray-900">{order?.id}</h2>
                            <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                            <div className="text-xs text-gray-500">
                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && !order?.isPaid
                                    ? 'Menunggu Pembayaran' :
                                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                        ? 'Siap untuk dikirim'
                                        : order?.orderStatus[0]?.status}
                            </div>
                            <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                        </div>
                    </div>
                </ConfirmAlert>
            ) : (
                <div className="flex items-center">
                    <div className="px-2">
                        <h2 className="font-medium text-gray-900">{order?.id}</h2>
                        <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                        <div className="text-xs text-gray-500">
                            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                ? 'Menunggu Pembayaran' : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                    ? 'Siap untuk dikirim' : 'Menunggu Proses Laundry'}
                        </div>
                        <div className="text-xs text-gray-500">
                            {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-1">
                <Link href={`https://wa.me/${order?.User?.phoneNumber}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                    <FaWhatsapp />
                </Link>
            </div>
        </section>
    )
}