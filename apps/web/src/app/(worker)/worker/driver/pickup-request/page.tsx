'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import { instance } from "@/utils/axiosInstance"
import authStore from "@/zustand/authstore"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaSearch } from 'react-icons/fa';
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/hooks/use-toast"
import { ConfirmAlert } from "@/components/core/confirmAlert"

export default function Page() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState("date-asc");
    const [activeTab, setActiveTab] = useState("semua");
    const limit = 5;

    const { data: dataOrderAwaitingPickup, refetch, isLoading: dataOrderAwaitingPickupLoading, isError: dataOrderAwaitingPickupError } = useQuery({
        queryKey: ['get-order', page, searchInput],
        queryFn: async () => {
            const tabValue =
                activeTab === "belumPickup" ? "AWAITING_DRIVER_PICKUP" :
                    activeTab === "proses" ? "DRIVER_TO_OUTLET" :
                        activeTab === "selesai" ? "DRIVER_ARRIVED_AT_OUTLET" : "";

            const res = await instance.get('/worker/order', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: tabValue,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessOrder, isPending } = useMutation({
        mutationFn: async (id: any) => {
            return await instance.post(`/worker/accept-order/${id}`, { email }, {

                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: any) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            refetch()
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })


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
        if (activeTab) {
            currentUrl.set("tab", activeTab);
        } else {
            currentUrl.delete(`tab`)
        }
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, activeTab, refetch]);


    const totalPages = dataOrderAwaitingPickup?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit md:hidden block md:max-w-full max-w-[425px]">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> DRIVER PICKUP
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="semua" onClick={() => { setActiveTab("semua"); setPage(1) }} >Semua</TabsTrigger>
                                    <TabsTrigger value="belumPickup" onClick={() => { setActiveTab("belumPickup"); setPage(1) }} >Belum PickUp</TabsTrigger>
                                    <TabsTrigger value="proses" onClick={() => { setActiveTab("proses"); setPage(1) }}>Proses</TabsTrigger>
                                    <TabsTrigger value="selesai" onClick={() => { setActiveTab("selesai"); setPage(1) }}>Selesai</TabsTrigger>
                                </TabsList>
                                <TabsContent value={activeTab}>
                                    <CardContent className="space-y-2 pt-2">
                                        <div className="flex justify-between gap-1 items-center">
                                            <div className="flex justify-between gap-1 items-center">
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
                                            <Select value={sortOption} onValueChange={setSortOption}>
                                                <SelectTrigger className="w-[150px] border rounded-md py-2 px-3">
                                                    <SelectValue placeholder="Sort By" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="date-asc">Tanggal Asc.</SelectItem>
                                                    <SelectItem value="date-desc">Tanggal Desc.</SelectItem>
                                                    <SelectItem value="name-asc">Customer Name Asc.</SelectItem>
                                                    <SelectItem value="name-desc">Customer Name Desc.</SelectItem>
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

                                                <ConfirmAlert
                                                    colorConfirmation="green"
                                                    caption={
                                                        order.latestStatus === 'AWAITING_DRIVER_PICKUP'
                                                            ? 'melakukan pengambilan laundry pada order ini'
                                                            : order.latestStatus === 'DRIVER_TO_OUTLET'
                                                                ? 'menyelesaikan pengiriman laundry pada order ini'
                                                                : ''
                                                    }
                                                    onClick={() => handleProcessOrder(order?.id)}>
                                                    <div className="flex items-center">
                                                        <div className="ml-2">
                                                            <h2 className="font-medium text-gray-900">
                                                                {order.userFirstName} {order.userLastName}
                                                            </h2>
                                                            <p className="text-xs text-gray-500">
                                                                {order.latestStatus === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                                                                    order.latestStatus === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                                                        order.latestStatus === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                                                            order.latestStatus}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                                        </div>
                                                    </div>
                                                </ConfirmAlert>

                                                <div className="flex gap-1">
                                                    <Link href={`https://wa.me/62${order.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                                        <FaWhatsapp />
                                                    </Link>
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
                            </Tabs>
                        </div>
                    </main>
                </section>
            </main>

            {/* web ssi */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex flex-col p-4 rounded-xl h-full bg-white">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Pickup Request</h1>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}