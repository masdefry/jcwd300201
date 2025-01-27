import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IPickupContentWeb } from "./type";

export default function PickupContentWeb(
    { order,
        handleProcessOrder,
        handleProcessOrderOutlet,
        handleProcessOrderPending,
        handleProcessOrderOutletPending, page, entriesPerPage, refetch, i }: IPickupContentWeb
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : 'Layanan Laundry'}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                    order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                        order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                            order?.orderStatus[0]?.status}
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
            <td className="py-4 px-6 hover:underline break-words">
                <ConfirmAlert disabled={(order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' && handleProcessOrderPending) || (order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' && handleProcessOrderOutletPending)
                }
                    colorConfirmation="blue" caption={order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                        ? 'Apakah anda yakin ingin melakukan pengambilan laundry pada order ini?'
                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                            ? 'Apakah anda yakin ingin menyelesaikan pengiriman laundry pada order ini?'
                            : ''}
                    onClick={order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? () => { handleProcessOrder(order?.id); refetch() }
                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? () => {
                            handleProcessOrderOutlet(order?.id)
                            refetch()
                        } : () => { }
                    }
                    description={order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Konfirmasi bahwa Anda akan mengambil laundry untuk order ini'
                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Konfirmasi bahwa barang untuk order ini telah berhasil diantar ke laundry'
                            : ''
                    }
                >
                    <button className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500' disabled={order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? true : false}>{order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Pickup' : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Selesaikan' :
                        order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Selesai' : 'Selesai'}</button>
                </ConfirmAlert>
            </td>
        </tr>
    )
}