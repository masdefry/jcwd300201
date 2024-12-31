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
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/hooks/use-toast"
import FilterWorker from "@/components/core/filter"
import Pagination from "@/components/core/pagination"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"
import Loading from "@/components/core/loading"
import NoData from "@/components/core/noData"

export default function HistoryOrderIroning() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "all");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [isSearchValues, setIsSearchValues] = useState<string>('')
    const limit = 5;

    const { data: dataOrderIroningProcess, refetch, isLoading: dataOrderIroningProcessLoading, isError: dataOrderIroningProcessError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption],
        queryFn: async () => {

            const res = await instance.get('/order/history-ironing', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res)
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
        if (dateFrom) {
            currentUrl.set('date-from', dateFrom?.toString())
        } else {
            currentUrl.delete('date-from')
        }
        if (dateUntil) {
            currentUrl.set('date-until', dateUntil?.toString())
        } else {
            currentUrl.delete('date-until')
        }
        if (page) {
            currentUrl.set('page', page?.toString())
        } else {
            currentUrl.delete('page')
        }
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderIroningProcess?.totalPage || 1;

    return (
        <>
            <MobileSessionLayout title="HISTORY ORDER">
                <div className="mx-4 space-y-4">

                    <CardContent className="space-y-2 pt-2">
                        <FilterWorker
                            searchInput={searchInput}
                            setPage={setPage}
                            debounce={debounce}
                            sortOption={sortOption}
                            setSortOption={setSortOption}
                            dateFrom={dateFrom}
                            dateUntil={dateUntil}
                            setDateFrom={setDateFrom}
                            setDateUntil={setDateUntil}
                            setActiveTab={setActiveTab}
                            setSearchInput={setSearchInput}
                            setIsSearchValues={setIsSearchValues}
                            isSearchValues={isSearchValues}

                        />
                        {dataOrderIroningProcessLoading && <Loading />}
                        {dataOrderIroningProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                        {!dataOrderIroningProcessLoading && dataOrderIroningProcess?.orders?.length > 0 ? (

                            dataOrderIroningProcess?.orders?.map((order: any) => (
                                <section
                                    key={order.id}
                                    className="flex justify-between items-center border-b py-4"
                                >

                                    <div className="flex items-center">
                                        <div className="ml-2">
                                            <h2 className="font-medium text-gray-900">
                                                {order?.User?.firstName} {order?.User?.lastName}
                                            </h2>
                                            <p className="text-xs text-gray-500">
                                                {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false ? 'Menunggu Persetujuan Admin' :
                                                    order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true ? 'Belum Dicuci' :
                                                        order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' ? 'Proses Cuci' :
                                                            order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' ? 'Selesai' :
                                                                order?.orderStatus[0]?.status}
                                            </p>
                                            <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                        </div>
                                    </div>

                                </section>
                            ))
                        ) : (
                            !dataOrderIroningProcessLoading && (
                                <NoData />
                            )

                        )}
                        {!dataOrderIroningProcessLoading && dataOrderIroningProcess?.orders?.length > 0 && (
                            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                        )}
                    </CardContent>
                </div>
            </MobileSessionLayout>
        </>
    )
}