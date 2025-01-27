import Link from "next/link";
import { IOrderTable } from "./type";

export default function TableBodyContent({ order, page, limit, index }: IOrderTable) {
    return (
        <tr className="hover:bg-gray-100 border-b">
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + index + 1}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words"> {order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Menunggu Pembuatan Nota Order' : ""}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{order?.orderTypeId == 1 ? 'Layanan Mencuci' : order?.orderTypeId == 2 ? 'Layanan Setrika' : 'Mencuci dan Setrika'}</td>
            <td className="py-3 px-6 text-sm text-gray-600 break-words">{new Date(order?.createdAt).toLocaleDateString()}</td>
            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                <Link href={`/worker/admin-outlet/nota-order/c/${order?.id}`}>Buat Nota</Link>
            </td>
        </tr>
    );
}