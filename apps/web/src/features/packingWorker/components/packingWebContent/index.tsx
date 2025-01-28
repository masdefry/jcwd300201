import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IPackingContentWebProps } from "./type";

export default function PackingContentWeb(
    { order,
        handleProcessPacking,
        isPending,
        router,
        limit,
        i,
        page
    }: IPackingContentWebProps
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : ''}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === false && order?.isDone === false
                    ? 'Belum Packing'
                    : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true
                        ? 'Proses Packing'
                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isDone === true
                            ? 'Selesai'
                            : order?.orderStatus[0]?.status}
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
            <td className="py-4 px-6 hover:underline break-words">
                <ConfirmAlert hoverColorConfirmation="blue" disabled={isPending} colorConfirmation="blue" caption={
                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' &&
                        order?.isProcessed === false &&
                        order?.isSolved === false
                        ? 'Order ini belum disetujui oleh admin untuk dilanjutkan'
                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' &&
                            order?.isProcessed === false &&
                            order?.isSolved === true
                            ? 'Apakah anda yakin ingin melakukan proses packing pada order ini?'
                            : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true
                                ? 'Apakah anda yakin ingin menyelesaikan proses packing pada order ini?'
                                : ''
                }
                    description={
                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isSolved === false
                            ? 'Silahkan hubungi admin'
                            : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isSolved === true
                                ? 'Pastikan anda memilih order yang tepat/benar'
                                : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                    ? 'Pastikan anda memilih order yang tepat/benar'
                                    : ''
                    }
                    onClick={() => {
                        if (order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === false) {
                            router.push(`/worker/packing-worker/order/c/${order?.id}`);
                        } else if (order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true) {
                            handleProcessPacking(order?.id);
                        }
                    }}
                >
                    <button disabled={order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isDone === true} className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500'>
                        {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === false && order?.isDone === false ? 'Proses' : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isProcessed === true ? 'Selesaikan' : 'Selesai'}
                    </button>
                </ConfirmAlert>
            </td>
        </tr>
    )
}