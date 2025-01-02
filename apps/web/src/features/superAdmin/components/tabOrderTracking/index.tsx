import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";

export default function TabTracking() {
    const [selectedTab, setSelectedTab] = useState<'today' | 'month'>('today');
    const [stats, setStats] = useState<any>(null);

    return (
        <section className="p-4">
            {/* Title with tabs */}
            <div className="flex justify-between items-center pb-4">
                <h1 className="font-bold text-xl text-neutral-700">
                    Pesanan{' '}
                    <span className="font-normal text-sm">
                        ({selectedTab === 'today' ? 'Hari Ini' : 'Bulan Ini'})
                    </span>
                </h1>

                <Tabs defaultValue="today">
                    <TabsList className="flex space-x-4">
                        <TabsTrigger value="today">Hari Ini</TabsTrigger>
                        <TabsTrigger value="month">Bulan Ini</TabsTrigger>
                    </TabsList>

                    {/* TabsContent will be automatically switched based on the selected tab */}
                    <TabsContent value="today">
                        {/* Content for Hari Ini */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* First Column */}
                            <div className="p-4 border-r border-neutral-300">
                                <h2 className="text-lg font-semibold text-gray-800">Total</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Laundry Price: </strong> Rp. {stats?.laundryPrice || 0}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Order Count: </strong> {stats?.orderCount || 0}
                                </p>
                            </div>

                            {/* Second Column */}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">Total Kg & Pcs</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Kg: </strong> {stats?.totalKg || 0} kg
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Pcs: </strong> {stats?.totalPcs || 0} pcs
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="month">
                        {/* Content for Bulan Ini */}
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {/* First Column */}
                            <div className="p-4 border-r border-neutral-300">
                                <h2 className="text-lg font-semibold text-gray-800">Total</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Laundry Price: </strong> Rp. {stats?.laundryPrice || 0}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Order Count: </strong> {stats?.orderCount || 0}
                                </p>
                            </div>

                            {/* Second Column */}
                            <div className="p-4">
                                <h2 className="text-lg font-semibold text-gray-800">Total Kg & Pcs</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    <strong>Kg: </strong> {stats?.totalKg || 0} kg
                                </p>
                                <p className="text-sm text-gray-500">
                                    <strong>Pcs: </strong> {stats?.totalPcs || 0} pcs
                                </p>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}