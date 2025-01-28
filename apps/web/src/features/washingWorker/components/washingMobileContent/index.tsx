import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IWashingContentMobileProps } from "./type";

export default function WashingContentMobile(
    { order,
        handleProcessWashing,
        isPending,
        router,
    }: IWashingContentMobileProps
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            {order?.orderStatus[0]?.status !== 'IN_IRONING_PROCESS' ? (
                <ConfirmAlert colorConfirmation="blue" caption={
                    order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                        ? 'Order ini belum disetujui oleh admin untuk dilanjutkan'
                        : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === true
                            ? 'Apakah anda yakin ingin melakukan proses cuci pada order ini?'
                            : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                ? 'Apakah anda yakin ingin menyelesaikan proses pada order ini?'
                                : ''
                }
                    description={
                        order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                            ? 'Silahkan hubungi admin'
                            : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === true
                                ? 'Pastikan anda memilih order yang tepat/benar'
                                : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                    ? 'Pastikan anda memilih order yang tepat/benar'
                                    : ''
                    }
                    hideButtons={order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false}
                    onClick={() => {
                        if (order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isProcessed === false) {
                            router.push(`/worker/washing-worker/order/c/${order?.id}`);
                        } else if (order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' && order?.isProcessed === true) {
                            handleProcessWashing(order?.id);
                        }
                    }}
                    disabled={isPending}>
                    <div className="flex items-center">
                        <div className="px-2">
                            <h2 className="font-medium text-gray-900">{order?.id?.length > 15 ? <span>{order?.id?.slice(0, 15)}..</span> : order?.id}</h2>
                            <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                            <p className="text-xs text-gray-500">
                                {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                    ? 'Menunggu Persetujuan Admin'
                                    : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true
                                        ? 'Belum Dicuci'
                                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                            ? 'Proses Cuci'
                                            : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                                ? 'Selesai'
                                                : order?.orderStatus[0]?.status}
                            </p>
                            <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                        </div>
                    </div>
                </ConfirmAlert>
            ) : (
                <div className="flex items-center">
                    <div className="px-2">
                        <h2 className="font-medium text-gray-900">{order?.id?.length > 15 ? <span>{order?.id?.slice(0, 15)}..</span> : order?.id}</h2>
                        <h2 className="font-medium text-gray-900">
                            {order?.User?.firstName} {order?.User?.lastName}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                ? 'Menunggu Persetujuan Admin'
                                : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true
                                    ? 'Belum Dicuci'
                                    : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                        ? 'Proses Cuci'
                                        : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                            ? 'Selesai'
                                            : order?.orderStatus[0]?.status}
                        </p>
                        <p className="text-xs text-gray-500">
                            {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                        </p>
                    </div>
                </div>
            )}

        </section>
    )
}