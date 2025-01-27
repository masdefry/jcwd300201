import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IPackingContentMobileProps } from "./type";

export default function PackingContentMobile(
    { order,
        handleProcessPacking,
        isPending,
        router,
    }: IPackingContentMobileProps
) {
    return (
        <section key={order.id} className="flex justify-between items-center border-b py-4">
            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isDone === true ? (
                <div className="flex items-center">
                    <div className="px-2">
                        <h2 className="font-medium text-gray-900">{order?.id}</h2>
                        <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                        <p className="text-xs text-gray-500">
                            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === false && !order?.isDone
                                ? 'Belum Packing'
                                : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true
                                    ? 'Proses Packing'
                                    : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isDone === true
                                        ? 'Selesai'
                                        : order?.orderStatus[0]?.status}</p>
                        <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                    </div>
                </div>
            ) : (
                <ConfirmAlert colorConfirmation="blue" caption={
                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === false && order?.isSolved === false ? 'Order ini belum disetujui oleh admin untuk dilanjutkan'
                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' &&
                            order?.isProcessed === false && order?.isSolved === true ? 'Apakah anda yakin ingin melakukan proses packing pada order ini?'
                            : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true ? 'Apakah anda yakin ingin menyelesaikan proses packing pada order ini?' : ''}
                    description={order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isSolved === false ? 'Silahkan hubungi admin'
                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isSolved === true ? 'Pastikan anda memilih order yang tepat/benar'
                            : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' ? 'Pastikan anda memilih order yang tepat/benar' : ''}
                    onClick={() => {
                        if (order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === false) {
                            router.push(`/worker/packing-worker/order/c/${order?.id}`);
                        } else if (order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true) {
                            handleProcessPacking(order?.id);
                        }
                    }} disabled={isPending}>
                    <div className="flex items-center">
                        <div className="px-2">
                            <h2 className="font-medium text-gray-900">{order?.id}</h2>
                            <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                            <p className="text-xs text-gray-500">
                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === false && order?.isDone === false
                                    ? 'Belum Packing'
                                    : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true
                                        ? 'Proses Packing'
                                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isDone === true
                                            ? 'Selesai'
                                            : order?.orderStatus[0]?.status}</p>
                            <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                        </div>
                    </div>
                </ConfirmAlert>
            )}
        </section>
    )
}