import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";
import { IPickupContent } from "./type";
import { IoLocationSharp } from "react-icons/io5";

export default function PickupContentMobile(
    { order,
        handleProcessOrder,
        handleProcessOrderOutlet,
        handleProcessOrderPending,
        handleProcessOrderOutletPending }: IPickupContent
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            <ConfirmAlert
                colorConfirmation="blue"
                caption={
                    order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                        ? 'Apakah anda yakin ingin melakukan pengambilan laundry pada order ini?'
                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                            ? 'Apakah anda yakin ingin menyelesaikan pengiriman laundry pada order ini?'
                            : ''
                }
                onClick={
                    order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                        ? () => handleProcessOrder(order?.id)
                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                            ? () => handleProcessOrderOutlet(order?.id)
                            : () => { }
                } description={
                    order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                        ? 'Konfirmasi bahwa Anda akan mengambil laundry untuk order ini'
                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                            ? 'Konfirmasi bahwa barang untuk order ini telah berhasil diantar ke laundry'
                            : 'Pesanan sudah diselesaikan'
                } hideButtons={order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'} disabled={(order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' && handleProcessOrderPending) || (order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' && handleProcessOrderOutletPending) || order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'}>
                <div className="flex items-center">
                    <div className="px-2">
                        <h2 className="font-medium text-gray-900">{order?.id?.length > 15 ? <span>{order?.id?.slice(0, 15)}..</span> : order?.id}</h2>
                        <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                        <p className="text-xs text-gray-500">
                            {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                                order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                    order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                        order?.orderStatus[0]?.status}</p>
                        <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                    </div>
                </div>
            </ConfirmAlert>

            <div className="flex gap-1">
                <Link href={`https://www.google.com/maps/search/?api=1&query=${order?.UserAddress?.latitude},${order?.UserAddress?.longitude}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                    <IoLocationSharp />
                </Link>

                <Link href={`https://wa.me/${order?.User?.phoneNumber}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                    <FaWhatsapp />
                </Link>
            </div>
        </section>
    )
}