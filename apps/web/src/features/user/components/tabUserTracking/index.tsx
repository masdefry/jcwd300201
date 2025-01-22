import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ITabTrackingProps } from "./type";
import { FaListAlt } from "react-icons/fa";
import { FaWeightHanging } from "react-icons/fa6";

export default function TabTracking({ selectedTab, setSelectedTab, dataOrder }: ITabTrackingProps) {
    return (
        <div className="flex w-full flex-col items-center pb-4">
            <h1 className="font-bold text-neutral-700 text-lg pb-2 sm:text-base">
                Pesanan{' '}
                <span className="font-normal text-sm">({selectedTab === 'today' ? 'Hari Ini' : 'Bulan Ini'})</span>
            </h1>

            <Tabs defaultValue="today" className="w-full">
                <TabsList className="flex space-x-4 bg-orange-100 rounded-md">
                    <TabsTrigger value="today" onClick={() => setSelectedTab('today')} className="w-full text-sm">
                        Hari Ini
                    </TabsTrigger>
                    <TabsTrigger value="month" onClick={() => setSelectedTab('month')} className="w-full text-sm">
                        Bulan Ini
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <div className="p-4 border border-neutral-300 shadow-sm flex items-center gap-4 rounded-lg">
                            <span className="text-orange-500"><FaListAlt className="text-3xl sm:text-2xl" /></span>
                            <div className="w-full">
                                <p className="text-sm sm:text-xs text-gray-500 mt-2">
                                    <strong>Pengeluaran: </strong> Rp. {(dataOrder?.totalSpent || 0).toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm sm:text-xs text-gray-500">
                                    <strong>Order: </strong> {dataOrder?.totalOrders || 0}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border border-neutral-300 shadow-sm flex items-center gap-4 rounded-lg">
                            <span className="text-blue-500">
                                <FaWeightHanging className="text-3xl sm:text-2xl" />
                            </span>
                            <div className="w-full">
                                <p className="text-sm sm:text-xs text-gray-500 mt-2"><strong>Kg: </strong> {dataOrder?.totalWeight || 0} kg</p>
                                <p className="text-sm sm:text-xs text-gray-500"><strong>Pcs: </strong> {dataOrder?.totalPcs || 0} pcs</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="month">
                    <div className="grid grid-cols-1 gap-4 mt-4">
                        <div className="p-4 border border-neutral-300 shadow-sm flex items-center gap-4 rounded-lg">
                            <span className="text-orange-500"><FaListAlt className="text-3xl sm:text-2xl" /></span>
                            <div className="w-full">
                                <p className="text-sm sm:text-xs text-gray-500 mt-2">
                                    <strong>Pendapatan: </strong> Rp. {(dataOrder?.totalSpent || 0).toLocaleString('id-ID')}
                                </p>
                                <p className="text-sm sm:text-xs text-gray-500">
                                    <strong>Order: </strong> {dataOrder?.totalOrders || 0}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 border border-neutral-300 shadow-sm flex items-center gap-4 rounded-lg">
                            <span className="text-blue-500">
                                <FaWeightHanging className="text-3xl sm:text-2xl" />
                            </span>
                            <div className="w-full">
                                <p className="text-sm sm:text-xs text-gray-500 mt-2"><strong>Kg: </strong> {dataOrder?.totalWeight || 0} kg</p>
                                <p className="text-sm sm:text-xs text-gray-500"><strong>Pcs: </strong> {dataOrder?.totalPcs || 0} pcs</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
