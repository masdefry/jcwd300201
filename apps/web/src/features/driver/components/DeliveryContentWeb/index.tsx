import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IDeliveryContentWeb } from "./type";

export default function DeliveryContentWeb(
    { order,
        handleProcessDelivery,
        handleAcceptOrderDelivery,
        handleProcessDeliveryPending,
        handleAcceptOrderDeliveryPending, page, limit, i }: IDeliveryContentWeb
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : 'Layanan Laundry'}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                    ? 'Menunggu Pembayaran' :
                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                        ? 'Siap untuk dikirim' :
                        order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                            ? 'Proses Pengiriman' :
                            order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true
                                ? 'Laundry berhasil diantar'
                                : 'Menunggu Pembayaran'
                }
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]}</td>
            <td className="py-4 px-6 hover:underline break-words">
                <ConfirmAlert colorConfirmation="blue"
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
                    }>
                    <button disabled={order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true} className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500'>
                        {order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true ? 'Selesai' : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true ? 'Proses' : 'Selesaikan'}</button>
                </ConfirmAlert>
            </td>
        </tr >
    )
}