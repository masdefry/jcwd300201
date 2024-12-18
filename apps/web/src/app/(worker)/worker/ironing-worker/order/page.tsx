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
import FilterWorker from "@/components/core/filter"
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

    const { data: dataOrderIroningProcess, refetch, isLoading: dataOrderIroningProcessLoading, isError: dataOrderIroningProcessError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get('/worker/order-ironing', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: activeTab,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',

                },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res)
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessIroning, isPending } = useMutation({
        mutationFn: async (id: any) => {
            return await instance.post(`/worker/ironing-done/${id}`, { email }, {

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
    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderIroningProcess?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> IRONING WORKER
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="semua" onClick={() => { setActiveTab("semua"); setPage(1) }} >Semua</TabsTrigger>
                                    <TabsTrigger value="belumDisetrika" onClick={() => { setActiveTab("belumDisetrika"); setPage(1) }} >Belum Setrika</TabsTrigger>
                                    <TabsTrigger value="prosesSetrika" onClick={() => { setActiveTab("prosesSetrika"); setPage(1) }} >Proses Setrika</TabsTrigger>
                                    <TabsTrigger value="selesai" onClick={() => { setActiveTab("selesai"); setPage(1) }}>Selesai</TabsTrigger>
                                </TabsList>
                                <TabsContent value={activeTab}>
                                    <CardContent className="space-y-2 pt-2">
                                        <FilterWorker
                                            debounce={debounce}
                                            sortOption={sortOption}
                                            setSortOption={setSortOption}
                                            dateFrom={dateFrom}
                                            dateUntil={dateUntil}
                                            setDateFrom={setDateFrom}
                                            setDateUntil={setDateUntil}
                                            setActiveTab={setActiveTab}
                                            setSearchInput={setSearchInput}
                                        />
                                        {dataOrderIroningProcessLoading && <p>Loading...</p>}
                                        {dataOrderIroningProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                                        {dataOrderIroningProcess?.orders?.map((order: any) => (
                                            <section
                                                key={order.id}
                                                className="flex justify-between items-center border-b py-4"
                                            >

                                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' ? (
                                                    <div className="flex items-center">
                                                        <div className="ml-2">
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.Users?.firstName} {order?.Users?.lastName}
                                                            </h2>
                                                            <p className="text-xs text-gray-500">
                                                                {order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === false
                                                                    ? 'Belum Disetrika'
                                                                    : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true
                                                                        ? 'Proses Setrika'
                                                                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                                            ? 'Selesai'
                                                                            : order?.orderStatus[0]?.status}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <ConfirmAlert
                                                        colorConfirmation="blue"
                                                        caption={
                                                            order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                                                                order?.isProcessed === false &&
                                                                order?.isSolved === false
                                                                ? 'Order ini belum disetujui oleh admin untuk dilanjutkan'
                                                                : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                                                                    order?.isProcessed === false &&
                                                                    order?.isSolved === true
                                                                    ? 'Apakah anda yakin ingin melakukan proses setrika pada order ini?'
                                                                    : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true
                                                                        ? 'Apakah anda yakin ingin menyelesaikan proses setrika pada order ini?'
                                                                        : ''
                                                        }
                                                        description={
                                                            order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                                                                order?.isProcessed === false &&
                                                                order?.isSolved === false
                                                                ? 'Silahkan hubungi admin'
                                                                : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' &&
                                                                    order?.isSolved === false &&
                                                                    order?.isSolved === true
                                                                    ? 'Pastikan anda memilih order yang tepat/benar'
                                                                    : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                        ? 'Pastikan anda memilih order yang tepat/benar'
                                                                        : ''
                                                        }
                                                        hideButtons={order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isSolved === false}
                                                        onClick={() => {
                                                            if (order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === false) {
                                                                router.push(`/worker/ironing-worker/c/${order?.id}`);
                                                            } else if (order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true) {
                                                                handleProcessIroning(order?.id);
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="ml-2">
                                                                <h2 className="font-medium text-gray-900">
                                                                    {order?.Users?.firstName} {order?.Users?.lastName}
                                                                </h2>
                                                                <p className="text-xs text-gray-500">
                                                                    {order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === false
                                                                        ? 'Belum Disetrika'
                                                                        : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' && order?.isProcessed === true
                                                                            ? 'Proses Setrika'
                                                                            : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                                                ? 'Selesai'
                                                                                : order?.orderStatus[0]?.status}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </ConfirmAlert>
                                                )}

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