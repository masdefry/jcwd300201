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
import { useQuery } from "@tanstack/react-query"
import { instance } from "@/utils/axiosInstance"
import authStore from "@/zustand/authstore"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaSearch } from 'react-icons/fa';

export default function DriverPickUp() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();


    const token = authStore((state) => state.token);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState("date-asc");
    const [filterOption, setFilterOption] = useState("");
    const limit = 5;

    const { data: dataOrderAwaitingPickup, isLoading: dataOrderAwaitingPickupLoading, isError: dataOrderAwaitingPickupError } = useQuery({
        queryKey: ['get-order', page, searchInput],
        queryFn: async () => {
            const res = await instance.get('/worker/order-wait', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    orderType: filterOption,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const debounce = useDebouncedCallback(values => {
        setSearchInput(values)
        setPage(1)
    }, 500);

    useEffect(() => {
        const currentUrl = new URLSearchParams(params.toString());
        if (searchInput) {
            currentUrl.set(`search`, searchInput)
        } else {
            currentUrl.delete(`search`)
        }
        if (sortOption) {
            currentUrl.set("sort", sortOption);
        } else {
            currentUrl.delete(`sort`)
        }
        if (filterOption) {
            currentUrl.set("orderType", filterOption);
        } else {
            currentUrl.delete(`orderType`)
        }
        router.push(`${pathname}?${currentUrl.toString()}`)

    }, [searchInput, page, sortOption, filterOption]);


    const totalPages = dataOrderAwaitingPickup?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit">
                    <HeaderMobile />

                    <main className="w-full">
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
                                        <div className="flex justify-between gap-1 items-center">
                                            <Select>
                                                <SelectTrigger className="w-[150px]">
                                                    <SelectValue placeholder="Pilih Lokasi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                                        <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                                        <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                                        <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                                        <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <div className="flex items-center justify-center">
                                                <div className="relative w-full max-w-md">
                                                    <input
                                                        type="text"
                                                        onChange={(e) => debounce(e.target.value)}
                                                        placeholder="Search..."
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                                </div>
                                            </div>
                                        </div>



                                        <div className="flex justify-between gap-1 items-center">
                                            <Select>
                                                <SelectTrigger className="w-[150px]">
                                                    <SelectValue placeholder="Filter" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>North America</SelectLabel>
                                                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                                        <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                                        <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                                        <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                                        <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                            <Select value={sortOption} onValueChange={setSortOption}>
                                                <SelectTrigger className="w-[150px] border rounded-md py-2 px-3">
                                                    <SelectValue placeholder="Sort By" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="date-asc">Date Ascending</SelectItem>
                                                    <SelectItem value="date-desc">Date Descending</SelectItem>
                                                    <SelectItem value="name-asc">Customer Name Ascending</SelectItem>
                                                    <SelectItem value="name-desc">Customer Name Descending</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>








                                        {dataOrderAwaitingPickupLoading && <p>Loading...</p>}
                                        {dataOrderAwaitingPickupError && <p>Silahkan coba beberapa saat lagi.</p>}
                                        {dataOrderAwaitingPickup?.orders?.map((order: any) => (
                                            <section
                                                key={order.id}
                                                className="flex justify-between items-center border-b py-4"
                                            >
                                                <div className="flex items-center">
                                                    <div className="ml-2">
                                                        <h2 className="font-medium text-gray-900">
                                                            {order.userFirstName} {order.userLastName}
                                                        </h2>
                                                        <p className="text-xs text-gray-500">
                                                            {order.latestStatus === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Driver' :
                                                                order.latestStatus === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                                                    order.latestStatus === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                                                        order.latestStatus}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{order.userPhoneNumber}</p>
                                                        <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                        <FaEdit />
                                                    </button>
                                                </div>
                                            </section>
                                        ))}

                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100"
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100"
                                            >
                                                Next
                                            </button>
                                        </div>
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