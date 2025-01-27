import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IOrderContentWeb } from "./type";

export default function OrderContentWeb(
    { order,
        setOrderData,
        handleOrderDetail,
        setOpenDialog,
        i,
        page,
        entriesPerPage
    }: IOrderContentWeb
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                    ? 'Menunggu Driver'
                    : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' || order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                        ? 'Proses Pickup'
                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' || order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' || order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                            ? 'Proses Laundry'
                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER'
                                ? 'Proses Delivery'
                                : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                                    ? 'Laundry Sampai'
                                    : 'Status tidak dikenal'}
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash Only' ? 'Mencuci dan Setrika' : 'Mencuci dan Setrika'}</td>
            <td className="py-4 px-6 text-sm hover:underline break-words">
                {order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isConfirm === false ?

                    <button className="text-blue-700 disabled:text-neutral-600 hover:text-blue-500" disabled={order?.laundryPrice === null || order?.laundryPrice === 0} onClick={() => {
                        setOrderData(null)
                        handleOrderDetail(order?.id)
                        setOpenDialog(true)
                    }}>Konfirmasi / Komplain</button>

                    :
                    <button className="text-blue-700 disabled:text-neutral-600 hover:text-blue-500" onClick={() => {
                        setOrderData(null)
                        handleOrderDetail(order?.id)
                        setOpenDialog(true)
                    }}>Lihat</button>
                }
            </td>
        </tr>
    )
}