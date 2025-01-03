import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";
import { ITabTrackingProps } from "./type";

export default function TabTrackingDriver({ selectedTab, setSelectedTab, dataOrder }: ITabTrackingProps) {

    return (
        <div className="flex w-full flex-col items-center pb-4">
            <h1 className="font-bold text-neutral-700">
                Penghasilan{' '}
                <span className="font-normal text-sm">
                    ({selectedTab === 'today' ? 'Hari Ini' : 'Bulan Ini'})
                </span>
            </h1>

            <Tabs defaultValue="today" className="w-full lg:w-fit">
                <TabsList className="flex space-x-4 bg-orange-100">
                    <TabsTrigger value="today" onClick={() => setSelectedTab('today')}>
                        Hari Ini
                    </TabsTrigger>
                    <TabsTrigger value="month" onClick={() => setSelectedTab('month')}>
                        Bulan Ini
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="today">
                    <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 mt-4">
                        <div className="p-2 border-r border-neutral-300 lg:border-0">
                            <h2 className="font-semibold text-gray-800">Pendapatan</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                <strong>Penghasilan: </strong> Rp. {dataOrder?.earnings || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Order: </strong> {dataOrder?.orderCount || 0}
                            </p>
                        </div>

                        <div className="p-2">
                            <h2 className="font-semibold text-gray-800">Total Berat & Pcs</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                <strong>Kg: </strong> {dataOrder?.totalKg || 0} kg
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Pcs: </strong> {dataOrder?.totalPcs || 0} pcs
                            </p>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="month">
                    <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 mt-4">
                        <div className="p-2 border-r border-neutral-300 lg:border-0">
                            <h2 className="font-semibold text-gray-800">Pendapatan</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                <strong>Penghasilan: </strong> Rp. {dataOrder?.earnings || 0}
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Order: </strong> {dataOrder?.orderCount || 0}
                            </p>
                        </div>

                        <div className="p-2">
                            <h2 className="font-semibold text-gray-800">Total Berat & Pcs</h2>
                            <p className="text-sm text-gray-500 mt-2">
                                <strong>Kg: </strong> {dataOrder?.totalKg || 0} kg
                            </p>
                            <p className="text-sm text-gray-500">
                                <strong>Pcs: </strong> {dataOrder?.totalPcs || 0} pcs
                            </p>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}