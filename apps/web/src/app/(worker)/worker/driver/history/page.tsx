'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import { instance } from "@/utils/axiosInstance"
import authStore from "@/zustand/authstore"
import { useState, useEffect, ChangeEvent } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/hooks/use-toast"
import FilterWorker from "@/components/core/filter"
import Pagination from "@/components/core/pagination"
import ContentWebLayout from "@/components/core/webSessionContent"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import ButtonCustom from "@/components/core/button"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import SearchInputCustom from "@/components/core/searchBar"
import { FaPlus } from "react-icons/fa6"

export default function HistoryOrderDriver() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "pickup");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const limit = 5;

    const { data: dataHistoryOrder, refetch, isLoading: dataHistoryOrderLoading, isError: dataHistoryOrderError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {

            const res = await instance.get('/order/history-driver', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                    tab: activeTab,
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
        if (activeTab) {
            currentUrl.set("tab", activeTab);
        } else {
            currentUrl.delete(`tab`)
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
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, activeTab, sortOption, refetch, dateFrom, dateUntil]);


    const totalPages = dataHistoryOrder?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> HISTORY ORDER
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="pickup" onClick={() => { setActiveTab("pickup"); setPage(1) }} >Pickup</TabsTrigger>
                                    <TabsTrigger value="delivery" onClick={() => { setActiveTab("delivery"); setPage(1) }} >Delivery</TabsTrigger>
                                </TabsList>
                                <TabsContent value={activeTab}>
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
                                        />
                                        {dataHistoryOrderLoading && <p>Loading...</p>}
                                        {dataHistoryOrderError && <p>Silahkan coba beberapa saat lagi.</p>}
                                        {dataHistoryOrder?.orders?.map((order: any) => {
                                            console.log(order?.isSolved)
                                            return (
                                                <section
                                                    key={order.id}
                                                    className="flex justify-between items-center border-b py-4"
                                                >

                                                    <div className="flex items-center">
                                                        <div className="ml-2">
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.id}
                                                            </h2>
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.User?.firstName} {order?.User?.lastName}
                                                            </h2>
                                                            <p className="text-xs text-gray-500">
                                                                {order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                                                    ? 'Selesai melakukan pickup'
                                                                    : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                                                                        ? 'Selesai melakukan delivery'
                                                                        : order?.orderStatus[0]?.status}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                                        </div>
                                                    </div>


                                                    <div className="flex gap-1">
                                                        <Link href={`https://wa.me/62${order?.User?.PhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                                            <FaWhatsapp />
                                                        </Link>
                                                    </div>
                                                </section>
                                            )
                                        })}

                                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </section>
            </main>

            <ContentWebLayout caption='Riwayat Penjemputan'>
                <div className="w-full h-fit flex">
                    <div className="w-1/2 gap-2 h-fit flex items-center">
                        <select name="searchWorker" value={activeTab} onChange={(e) => {
                            setActiveTab(e.target.value)
                            setPage(1)
                        }} id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="all">Semua Pesanan</option>
                            <option value="waiting-pickup">Belum pickup</option>
                            <option value="process-pickup">Dalam perjalanan</option>
                            <option value="arrived">Selesai</option>
                            <option value="all">Reset</option>
                        </select>
                        <select name="sort" value={sortOption} onChange={(e) => {
                            setSortOption(e.target.value)
                            setPage(1)
                        }} id="sort" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="date-asc">Tanggal Terlama</option>
                            <option value="date-desc">Tanggal Terbaru</option>
                            <option value="name-asc">Urutkan nama A - Z</option>
                            <option value="name-desc">Urutkan nama Z - A</option>
                        </select>
                    </div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tipe Order</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tanggal dibuat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataHistoryOrder?.orders?.length > 0 ? (
                                dataHistoryOrder?.orders?.map((order: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Strika' : 'Layanan Laundry'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                                    ? 'Selesai melakukan pickup'
                                                    : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                                                        ? 'Selesai melakukan delivery'
                                                        : order?.orderStatus[0]?.status}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold text-3xl text-neutral-300">Data Tersedia</td>
                                </tr>
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