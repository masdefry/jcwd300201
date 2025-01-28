import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IIroningContentWebProps } from "./type";

export default function IroningContentWeb(
    { order,
        handleProcessIroning,
        isPending,
        router,
        limit,
        i,
        page
    }: IIroningContentWebProps
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : ''}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
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
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
            <td className="py-4 px-6 hover:underline break-words">
                <ConfirmAlert
                    colorConfirmation="blue"
                    disabled={isPending}
                    caption={
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
                    }
                    description={
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
                    }}
                >
                    <button disabled={order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' || ((order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' || order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS') && order?.OrderType?.type === 'Wash & Iron')} className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500'>
                        {order?.orderStatus[0]?.status === "IN_IRONING_PROCESS" && order?.isProcessed === false ? 'Proses' : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true ? 'Selesaikan' : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.orderTypeId === 3 ? "Proses" : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.orderTypeId === 2 ? "Proses" : 'Selesai'}
                    </button>
                </ConfirmAlert>
            </td>
        </tr>
    )
}