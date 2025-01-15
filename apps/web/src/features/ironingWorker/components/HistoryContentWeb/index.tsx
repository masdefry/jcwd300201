import { IHistoryContentWeb } from "./type";

export default function HistoryContentWeb(
    { order, page, limit, i }: IHistoryContentWeb
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.orderTypeId === 1 ? 'Layanan Mencuci' : order?.orderTypeId === 2 ? 'Layanan Setrika' : order?.orderTypeId === 3 ? 'Mencuci dan Setrika' : ''}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                    ? 'Telah melalui proses setrika'
                    : order?.orderStatus[0]?.status}

            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
        </tr>
    )
}