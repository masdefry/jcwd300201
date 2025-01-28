import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IIroningContentMobileProps } from "./type";

export default function IroningContentMobile(
    { order,
        handleProcessIroning,
        isPending,
        router,
    }: IIroningContentMobileProps
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' || ((order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' || order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS') && order?.OrderType?.type === 'Wash & Iron') ? (
                <div className="flex items-center">
                    <div className="px-2">
                        <h2 className="font-medium text-gray-900">{order?.id}</h2>
                        <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                        <p className="text-xs text-gray-500">
                            {order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === false
                                ? 'Belum Disetrika'
                                : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isProcessed === false && order?.orderTypeId === 2
                                    ? 'Belum Disetrika'
                                    : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true
                                        ? 'Proses Setrika'
                                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                            ? 'Selesai'
                                            : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.orderTypeId === 3
                                                ? 'Menunggu Proses Cuci Selesai'
                                                : order?.orderStatus[0]?.status}
                        </p>
                        <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                    </div>
                </div>
            ) : (
                <ConfirmAlert colorConfirmation="blue" caption={
                    order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                        order?.isProcessed === false &&
                        order?.isSolved === false
                        ? 'Order ini belum disetujui oleh admin untuk dilanjutkan'
                        : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                            order?.isProcessed === false &&
                            order?.isSolved === true
                            ? 'Apakah anda yakin ingin melakukan proses setrika pada order ini?'
                            : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' &&
                                order?.isProcessed === false &&
                                order?.isSolved === true
                                ? 'Apakah anda yakin ingin melakukan proses setrika pada order ini?'
                                : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true
                                    ? 'Apakah anda yakin ingin menyelesaikan proses setrika pada order ini?'
                                    : ''
                } description={
                    order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                        order?.isProcessed === false &&
                        order?.isSolved === false
                        ? 'Silahkan hubungi admin'
                        : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                            order?.isProcessed === false &&
                            order?.isSolved === true
                            ? 'Pastikan anda memilih order yang tepat/benar'
                            : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' &&
                                order?.isProcessed === false &&
                                order?.isSolved === true
                                ? 'Pastikan anda memilih order yang tepat/benar'
                                : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true
                                    ? 'Pastikan anda memilih order yang tepat/benar'
                                    : ''
                }
                    hideButtons={(order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' || order?.orderStatus[0]?.status === 'AWAITING_PAYMENT') && order?.isSolved === false}
                    onClick={() => {
                        if ((order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' || order?.orderStatus[0]?.status === 'AWAITING_PAYMENT') && order?.isProcessed === false) {
                            router.push(`/worker/ironing-worker/order/c/${order?.id}`);
                        } else if (order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true) {
                            handleProcessIroning(order?.id);
                        }
                    }} disabled={isPending}>
                    <div className="flex items-center">
                        <div className="px-2">
                            <h2 className="font-medium text-gray-900">{order?.id}</h2>
                            <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                            <p className="text-xs text-gray-500">
                                {order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === false
                                    ? 'Belum Disetrika'
                                    : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isProcessed === false
                                        ? 'Belum Disetrika'
                                        : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true
                                            ? 'Proses Setrika'
                                            : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                ? 'Selesai'
                                                : order?.orderStatus[0]?.status}
                            </p>
                            <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                        </div>
                    </div>
                </ConfirmAlert>
            )}
        </section>
    )
}