import { IHistoryContent } from "./type";

export default function HistoryContentMobile(
    { order }: IHistoryContent
) {
    return (
        <section
            key={order.id}
            className="flex justify-between items-center border-b py-4"
        >

            <div className="flex items-center">
                <div className="px-2">
                    <h2 className="font-medium text-gray-900">
                        {order?.id}
                    </h2>
                    <h2 className="font-medium text-gray-900">
                        {order?.User?.firstName} {order?.User?.lastName}
                    </h2>
                    <p className="text-xs text-gray-500">
                        {order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                            ? 'Telah melalui proses cuci'
                            : order?.orderStatus[0]?.status}
                    </p>
                    <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                </div>
            </div>
        </section>
    )
}