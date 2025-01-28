import NoDataWidget from "@/components/core/noDataWidgetComponent"
import Notification from "@/components/core/notificationCustom"
import Link from "next/link"

export default function WidgetDashboardWeb({ data, title, dataOrderNotif }: IWidgetDashboardWeb) {
    return (
        <div className="w-full h-full overflow-y-auto bg-white bg-opacity-45 rounded-xl p-4">
            <div className="flex justify-between">
                <div className="flex items-center gap-4 pb-4">
                    <h1 className='font-bold text-2xl text-neutral-700'>{title}</h1>
                    <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                </div>
                <Notification dataOrderNotif={dataOrderNotif} />
            </div>
            <div className="w-full space-y-4">
                {data?.orders?.length > 0 ? (data?.orders?.map((order, i: number) => (
                    <div key={i} className='flex px-2 justify-between items-center w-full gap-4 border-b pb-3'>
                        <div className="w-full flex items-center">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <div className='w-fit px-3'>
                                <h1 className="font-semibold text-gray-700">{order?.User?.firstName} {order?.User?.lastName}</h1>
                                <p className="text-gray-500 text-sm">
                                    {order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' :
                                        order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' :
                                            order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' :
                                                'Layanan Laundry'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href='/worker/washing-worker/order?tab=in-washing' className='text-blue-500 hover:text-blue-700 text-sm'>
                                Proses
                            </Link>
                        </div>
                    </div>
                ))) : <NoDataWidget/>}
            
                <Link href='/worker/washing-worker/order?tab=in-washing' className='flex text-sm justify-end text-blue-600 hover:text-blue-800'>
                    Lihat Selengkapnya...
                </Link>
            </div>
        </div>
    )
}