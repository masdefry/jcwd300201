import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { IWashingContentWebProps } from "./type";

export default function WashingContentWeb(
    { order,
        handleProcessWashing,
        isPending,
        router,
        limit,
        i,
        page
    }: IWashingContentWebProps
) {
    return (
        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                <div>{order?.User?.firstName} {order?.User?.lastName}</div>
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : ''}</td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                    ? 'Menunggu Persetujuan Admin'
                    : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true
                        ? 'Belum Dicuci'
                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                            ? 'Proses Cuci'
                            : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                ? 'Selesai'
                                : order?.orderStatus[0]?.status}
            </td>
            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
            <td className="py-4 px-6 hover:underline break-words">
                <ConfirmAlert disabled={isPending} colorConfirmation="blue" caption={
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
                        } else {
                            handleProcessWashing(order?.id)
                        }
                    }}>
                    <button disabled={order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'} className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500'>
                        {order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' ? 'Selesai' :
                            order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' ? 'Proses' :
                                'Selesaikan'}
                    </button>
                </ConfirmAlert>
            </td>
        </tr>
    )
}