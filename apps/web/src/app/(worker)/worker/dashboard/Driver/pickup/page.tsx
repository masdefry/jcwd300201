'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import {
    CardContent,
} from "@/components/ui/card"
import LocationAndSearch from "@/features/workerData/components/locationAndSearch"
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import ProcessAndSortDate from "@/features/order/components/processAndSortDate"

export default function DriverPickUp() {
    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit">
                    <HeaderMobile />

                    <main className="w-full"> {/* Ensure the parent spans the full width */}
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> DRIVER PICKUP
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue="semua" className="fit">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="semua">Semua</TabsTrigger>
                                    <TabsTrigger value="belumPickup">Belum PickUp</TabsTrigger>
                                    <TabsTrigger value="proses">Proses</TabsTrigger>
                                    <TabsTrigger value="selesai">Selesai</TabsTrigger>
                                </TabsList>
                                <TabsContent value="semua">
                                    <CardContent className="space-y-2 pt-2">
                                        <LocationAndSearch />
                                        <ProcessAndSortDate />

                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>

                                </TabsContent>
                                <TabsContent value="belumPickup">
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>

                                </TabsContent>
                                <TabsContent value="proses">
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>
                                </TabsContent>
                                <TabsContent value="selesai">
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>
                                </TabsContent>
                                
                            </Tabs>

                        </div>
                    </main>
                </section>
            </main>
        </>
    )
}