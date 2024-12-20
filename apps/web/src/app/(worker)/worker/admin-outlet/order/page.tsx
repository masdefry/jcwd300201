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
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/hooks/use-toast"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import Pagination from "@/components/core/pagination"

export default function DriverPickUp() {
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
    const [dateFrom, setDateFrom] = useState(params.get('dateFrom') || null);
    const [dateUntil, setDateUntil] = useState(params.get('dateUntil') || null);
    const limit = 5;

    const { data: dataOrderWashingProcess, refetch, isLoading: dataOrderWashingProcessLoading, isError: dataOrderWashingProcessError } = useQuery({
        queryKey: ['get-order', page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const tabValue =
                activeTab === "belumDicuci" ? "AWAITING_PAYMENT" :
                    activeTab === "belumDicuci" ? "AWAITING_PAYMENT" :
                        activeTab === "prosesCuci" ? "IN_WASHING_PROCESS" :
                            activeTab === "prosesSetrika" ? "IN_IRONING_PROCESS" :
                                activeTab === "prosesPacking" ? "IN_PACKING_PROCESS" :
                                    activeTab === "selesai" ? "IN_PACKING_PROCESS" :
                                        "";

            const res = await instance.get('/order/order-washing', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: tabValue,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res)
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessOrder, isPending } = useMutation({
        mutationFn: async (id: any) => {
            return await instance.post(`/order/accept-order/${id}`, { email }, {

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
        if (dateFrom) {
            currentUrl.set(`dateFrom`, dateFrom?.toString())
        } else {
            currentUrl.delete(`dateFrom`)
        }
        if (dateUntil) {
            currentUrl.set(`dateUntil`, dateUntil?.toString())
        } else {
            currentUrl.delete(`dateUntil`)
        }
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, dateFrom, dateUntil, activeTab, refetch]);


    const totalPages = dataOrderWashingProcess?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> WASHING WORKER
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="semua" onClick={() => { setActiveTab("semua"); setPage(1) }} >Semua</TabsTrigger>
                                    <TabsTrigger value="belumDicuci" onClick={() => { setActiveTab("belumDicuci"); setPage(1) }} >Belum Dicuci</TabsTrigger>
                                    <TabsTrigger value="prosesCuci" onClick={() => { setActiveTab("prosesCuci"); setPage(1) }} >Proses Cuci</TabsTrigger>
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
                                                    <SelectItem value="date-asc">Tanggal Terbaru</SelectItem>
                                                    <SelectItem value="date-desc">Tanggal Terbaru</SelectItem>
                                                    <SelectItem value="name-asc">Nama Cust. A-Z</SelectItem>
                                                    <SelectItem value="name-desc">Nama Cust. Z-A</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {dataOrderWashingProcessLoading && <p>Loading...</p>}
                                        {dataOrderWashingProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                                        {dataOrderWashingProcess?.orders?.map((order: any) => (
                                            <section
                                                key={order.id}
                                                className="flex justify-between items-center border-b py-4"
                                            >

                                                <ConfirmAlert
                                                    colorConfirmation="green"
                                                    caption={
                                                        order.latestStatus === 'AWAITING_PAYMENT'
                                                            ? 'Apakah anda yakin ingin melakukan proses cuci pada order ini?'
                                                            : order.latestStatus === 'IN_WASHING_PROCESS'
                                                                ? 'Apakah anda yakin ingin menyelesaikan proses pada order ini?'
                                                                : ''
                                                    }
                                                    onClick={() => handleProcessOrder(order?.id)}>
                                                    <div className="flex items-center">
                                                        <div className="ml-2">
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.id}
                                                            </h2>
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.userFirstName} {order?.userLastName}
                                                            </h2>
                                                            <p className="text-xs text-gray-500">
                                                                {order.latestStatus === 'AWAITING_PAYMENT' ? 'Belum Dicuci' :
                                                                    order.latestStatus === 'IN_WASHING_PROCESS' ? 'Proses Cuci' :
                                                                        order.latestStatus === 'IN_IRONING_PROCESS' ? 'Selesai' :
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

                                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
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