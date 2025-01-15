import { IHistoryContentWeb } from "./type";

export default function HistoryContentWeb(
    { order, page, limit, i }: IHistoryContentWeb
) {
    return (
        
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : 'Layanan Laundry'}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                    ? 'Selesai melakukan pickup'
                    : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                        ? 'Selesai melakukan delivery'
                        : order?.orderStatus[0]?.status}
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
        </tr>
    )
}