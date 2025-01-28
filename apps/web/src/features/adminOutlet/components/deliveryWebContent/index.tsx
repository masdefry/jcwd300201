import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IDeliveryContentWeb } from "./type";

export default function DeliveryContentWeb(
    { order,
        handleRequestDelivery,
        page, limit, i }: IDeliveryContentWeb
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                    ? 'Menunggu Pembayaran' :
                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                        ? 'Siap untuk dikirim'
                        : 'Menunggu Proses Laundry'}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : 'Mencuci dan Setrika'}</td>
            <td className="py-4 px-6 text-sm text-blue-600 break-words">
                <ConfirmAlert colorConfirmation="blue"
                    caption={
                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                            ? 'Apakah Anda ingin request pengiriman untuk pesanan ini?'
                            : ''
                    }
                    description={
                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                            ? 'Pastikan anda memilih order yang tepat/benar'
                            : ''
                    } onClick={() => handleRequestDelivery(order?.id)}>
                    <button className="text-blue-600 hover:text-blue-400 relative group">
                        Kirim Laundry
                    </button>
                </ConfirmAlert>
            </td>
        </tr>
    )
}