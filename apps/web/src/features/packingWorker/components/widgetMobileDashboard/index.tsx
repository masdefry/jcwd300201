import Link from "next/link"
import { IWidgetDashboardMobileDriver } from "./type"
import NoDataWidget from "@/components/core/noDataWidgetComponent"

export default function WidgetDashboardMobile({link, data, title }: IWidgetDashboardMobileDriver) {
    return (
        <div className="w-full flex justify-center flex-col h-full border border-gray-300 overflow-y-auto bg-white bg-opacity-45 rounded-xl p-2">
            <div className="flex items-center gap-4 pb-4">
                <h1 className='font-bold text-base text-neutral-700'>{title}</h1>
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
            </div>
            <div className="w-full space-y-2 max-h-[calc(3*3rem)] overflow-y-auto">
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
                            <Link href='/worker/packing-worker/order?tab=packing-process' className='text-blue-500 hover:text-blue-700 text-sm'>
                                Proses
                            </Link>
                        </div>
                    </div>
                ))):<NoDataWidget/>}
                <Link href='/worker/packing-worker/order?tab=packing-process' className='flex text-sm justify-end text-blue-600 hover:text-blue-800'>
                    Lihat Selengkapnya...
                </Link>
            </div>
        </div>
    )
}