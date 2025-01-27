import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IOrderContentWeb } from "./type";

export default function OrderContentWeb(
    { order,
        setOrderData,
        page, handleOrderDetail, i, setOpenDialog, entriesPerPage }: IOrderContentWeb
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                    ? 'Menunggu Driver'
                    : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                        ? 'Driver Menuju Store'
                        : order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                            ? 'Diterima Outlet'
                            : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                ? 'Proses Cuci'
                                : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                    ? 'Proses Setrika'
                                    : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                        ? 'Proses Packing'
                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER'
                                            ? 'Proses Delivery'
                                            : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                                                ? 'Laundry Sampai'
                                                : 'Status tidak dikenal'}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.Store?.storeName}</td>
            <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                <div onClick={() => {
                    setOrderData(null);
                    handleOrderDetail(order?.id);
                    setOpenDialog(true)
                }}>View</div>
            </td>
        </tr>
    )
}