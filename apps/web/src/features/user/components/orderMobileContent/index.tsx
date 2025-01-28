import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IOrderContentMobile } from "./type";

export default function OrderContentMobile(
    { order,
        setOrderData,
        handleOrderDetail,
        setOpenDialog,
    }: IOrderContentMobile
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            <div onClick={() => {
                setOrderData(null);
                handleOrderDetail(order?.id);
                setOpenDialog(true)
            }} className="flex items-center">
                <div className="px-2">
                    <h2 className="font-medium text-gray-900">{order?.id.length > 15 ? <span>{order?.id?.slice(0, 15)}..</span> : order?.id}</h2>
                    <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                    <div className="text-xs text-gray-500">
                        {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                            ? 'Menunggu Driver'
                            : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' || order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                ? 'Proses Pickup'
                                : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' || order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' || order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                    ? 'Proses Laundry'
                                    : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER'
                                        ? 'Proses Delivery'
                                        : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                                            ? 'Laundry Sudah Sampai'
                                            : 'Status tidak dikenal'}</div>
                    <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                </div>
            </div>
            {order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isConfirm === false ?
                <div className="border text-center w-fit text-sm px-1 rounded-md bg-yellow-200 border-yellow-600 text-yellow-600">
                    Konfirmasi Order
                </div>
                : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isConfirm === true ?
                    <div className="border w-fit text-sm px-1 rounded-md bg-green-200 border-green-600 text-green-600">
                        Terkonfirmasi
                    </div>
                    : ''}
        </section>
    )
}
