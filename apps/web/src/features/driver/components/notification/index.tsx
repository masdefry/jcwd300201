import { IoIosNotifications } from "react-icons/io";
import { useState } from "react";
import { INotificationProps } from "./type";



export default function NotificationDriver({ dataOrderNotif }: INotificationProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsDialogOpen(!isDialogOpen)}
                className=" text-2xl text-yellow-400 focus:outline-none"
            >
                <IoIosNotifications />
            </button>

            {isDialogOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white drop-shadow-lg rounded-lg p-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        <button onClick={() => setIsDialogOpen(!isDialogOpen)} className="text-gray-500">
                            X
                        </button>
                    </div>

                    <ul className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                        {dataOrderNotif?.orders?.length ? (
                            dataOrderNotif.orders.map((order, i: number) => (
                                <li
                                    key={order.id}
                                    className={`text-sm text-gray-600 py-2 ${i !== dataOrderNotif.orders.length - 1 ? "border-b border-gray-300" : ""
                                        }`}
                                >
                                    {order?.orderStatus[0]?.status === "AWAITING_DRIVER_PICKUP" ? (
                                        <>
                                            Pengantaran Laundry Baru: <b>#{order?.id}</b> | {order?.User?.firstName} {order?.User?.lastName} | {order?.OrderType?.type}
                                        </>
                                    ) : (
                                        <>
                                            Penjemputan Laundry Baru: <b>#{order?.id}</b> | {order?.User?.firstName} {order?.User?.lastName} | {order?.OrderType?.type}
                                        </>
                                    )}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm text-gray-400 font-bold">
                                Tidak Ada Pekerjaan Baru
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}