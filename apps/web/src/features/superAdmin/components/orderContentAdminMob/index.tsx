import Link from "next/link";
import { IOrderContent } from "./type";
import { FaWhatsapp } from "react-icons/fa6";

export default function OrderContentAdminMobile(
    { order, setOrderData, handleOrderDetail, setOpenDialog }: IOrderContent
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            <div onClick={() => {
                setOrderData(null)
                handleOrderDetail(order?.id)
                setOpenDialog(true)
            }} className="flex items-center">
                <div className="ml-2">
                    <h2 className="font-medium text-gray-900">{order?.id?.length > 15 ? <span>{order?.id.slice(0, 15)}..</span> : order?.id}</h2>
                    <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                    <div className="text-xs text-gray-500">
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
                                                        : 'Status tidak dikenal'}
                    </div>
                    <p className="text-xs text-gray-500">
                        {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                    </p>
                </div>
            </div>

            <div className="flex gap-1">
                <Link href={`https://wa.me/${order?.User?.phoneNumber}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                    <FaWhatsapp />
                </Link>
            </div>
        </section>
    )
}