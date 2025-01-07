'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft, FaHistory } from "react-icons/fa"
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
import NoData from "@/components/core/noData"
import Loading from "@/components/core/loading"
import ContentWebLayout from "@/components/core/webSessionContent"
import FilterWeb from "@/components/core/filterWeb"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import ButtonCustom from "@/components/core/button"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"

export default function HistoryOrderWashing() {
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

    const { data: dataOrderWashingProcess, refetch, isFetching, isLoading: dataOrderWashingProcessLoading, isError: dataOrderWashingProcessError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption],
        queryFn: async () => {

            const res = await instance.get('/order/history-washing', {
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


    const totalPages = dataOrderWashingProcess?.totalPage || 1;

    return (
        <>
            <ContentMobileLayout icon={<FaHistory className='text-lg' />} title="Riwayat">
                <div className="pb-28">
                    <CardContent className="space-y-2">
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
                        {dataOrderWashingProcessLoading && <Loading />}
                        {dataOrderWashingProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                        {!dataOrderWashingProcessLoading && dataOrderWashingProcess?.orders?.length > 0 ? (
                            dataOrderWashingProcess?.orders?.map((order: any) => (
                                <section key={order.id} className="flex justify-between items-center border-b py-4">
                                    <div className="flex items-center">
                                        <div className="px-2">
                                            <h2 className="font-medium text-gray-900">
                                                {order?.id}
                                            </h2>
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


                                    <div className="flex gap-1">
                                        <Link href={`https://wa.me/62${order.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                            <FaWhatsapp />
                                        </Link>
                                    </div>
                                </section>
                            ))
                        ) : (
                            !dataOrderWashingProcessLoading && (
                                <NoData />
                            )

                        )}
                        {!dataOrderWashingProcessLoading && dataOrderWashingProcess?.orders?.length > 0 && (
                            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                        )}
                    </CardContent>
                </div>
            </ContentMobileLayout>

            <ContentWebLayout caption='Riwayat Pesanan'>
                <FilterWeb
                    activeTab={activeTab}
                    dateFrom={dateFrom}
                    dateUntil={dateUntil}
                    debounce={debounce}
                    isSearchValues={isSearchValues}
                    searchInput={searchInput}
                    setActiveTab={setActiveTab}
                    setDateFrom={setDateFrom}
                    setDateUntil={setDateUntil}
                    setIsSearchValues={setIsSearchValues}
                    setPage={setPage}
                    setSearchInput={setSearchInput}
                    setSortOption={setSortOption}
                    sortOption={sortOption}
                    borderReset="rounded-full border"
                    options={[
                        { value: 'all', label: 'Semua' },
                        { value: 'not-washed', label: 'Belum Dicuci' },
                        { value: 'in-washing', label: 'Proses Cuci' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                />
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tipe Order</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tanggal dibuat</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderWashingProcessLoading && dataOrderWashingProcess?.orders?.length > 0 ? (
                                    dataOrderWashingProcess?.orders?.map((order: any, i: number) => (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : ''}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                    ? 'Menunggu Persetujuan Admin'
                                                    : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true
                                                        ? 'Belum Dicuci'
                                                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                            ? 'Proses Cuci'
                                                            : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                                                ? 'Selesai'
                                                                : order?.orderStatus[0]?.status}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
                                            <td className="py-4 px-6 hover:underline break-words"></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderWashingProcessLoading ? <span className="py-10"><Loading /></span> : <NoData />}
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                    <PaginationWebLayout currentPage={page} totalPages={totalPages || '1'}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Sebelumnya</ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => { setPage((prev) => Math.min(prev + 1, totalPages)) }}>Selanjutnya</ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}