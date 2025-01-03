'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { CardContent } from "@/components/ui/card"
import { ChangeEvent } from "react"
import { FaWhatsapp } from "react-icons/fa";
import FilterWorker from "@/components/core/filter"
import Pagination from "@/components/core/pagination"
import ContentWebLayout from "@/components/core/webSessionContent"
import ButtonCustom from "@/components/core/button"
import SearchInputCustom from "@/components/core/searchBar"
import TableHeadNotaOrder from "@/features/adminOutlet/components/tableHeadNotaOrder"
import TableHeadLayout from "@/features/adminOutlet/components/tableHeadLayout"
import TableBodyNotFound from "@/features/adminOutlet/components/tableBodyDataNotFound"
import TableBodyContent from "@/features/adminOutlet/components/tableBodyContent"
import { useNotaOrderHooks } from "@/features/adminOutlet/hooks/useNotaOrderHooks"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import Loading from "@/components/core/loading"
import NoData from "@/components/core/noData"
import FilterWeb from "@/components/core/filterWeb"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"

export default function HistoryOrderWashing() {
    const { page, totalPages, sortOption, dateFrom, dateUntil, limit,
        debounce, setSearchInput, setSortOption, activeTab, setActiveTab,
        setDateFrom, setDateUntil, dataCreateOrder, dataCreateOrderLoading,
        dataCreateOrderError, setPage, searchInput, isSearchValues, setIsSearchValues } = useNotaOrderHooks()

    return (
        <>
            <MobileSessionLayout title="Nota Pesanan">
                <CardContent className="space-y-2 pb-28">
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
                        searchInput={searchInput}
                        setPage={setPage}
                        setIsSearchValues={setIsSearchValues}
                        isSearchValues={isSearchValues}
                    />
                    {dataCreateOrderLoading && <Loading />}
                    {dataCreateOrderError && <p>Silahkan coba beberapa saat lagi.</p>}
                    {!dataCreateOrderLoading && dataCreateOrder?.orders?.length > 0 ? (
                        dataCreateOrder?.orders?.map((order: any) => {
                            return (
                                <section key={order.id} className="flex justify-between items-center border-b py-4">
                                    <Link href={`/worker/admin-outlet/nota-order/c/${order?.id}`}>
                                        <div className="flex items-center">
                                            <div className="ml-2">
                                                <h2 className="font-medium text-gray-900">
                                                    {order?.id}
                                                </h2>
                                                <h2 className="font-medium text-gray-900">
                                                    {order?.User?.firstName} {order?.User?.lastName}
                                                </h2>
                                                <p className="text-xs text-gray-500">
                                                    {order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Menunggu Pembuatan Nota Order' : ""}
                                                </p>
                                                <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className="flex gap-1">
                                        <Link href={`https://wa.me/62${order?.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                            <FaWhatsapp />
                                        </Link>
                                    </div>
                                </section>
                            )
                        })
                    ) : (
                        !dataCreateOrderLoading && (
                            <NoData />
                        )

                    )}
                    {!dataCreateOrderLoading && dataCreateOrder?.orders?.length > 0 && (
                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                    )}
                </CardContent>
            </MobileSessionLayout >

            <ContentWebLayout caption='Nota Pesanan'>
                <FilterWeb
                    isSearchValues={isSearchValues}
                    setIsSearchValues={setIsSearchValues}
                    debounce={debounce}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    dateFrom={dateFrom}
                    dateUntil={dateUntil}
                    setDateFrom={setDateFrom}
                    setDateUntil={setDateUntil}
                    setActiveTab={setActiveTab}
                    setSearchInput={setSearchInput}
                    activeTab={activeTab}
                    setPage={setPage}
                    showStoreSelect={false}
                    searchInput={searchInput}
                    showTabOption={false}
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeadLayout>
                            <TableHeadNotaOrder />
                        </TableHeadLayout>
                        <tbody>
                            {dataCreateOrderLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataCreateOrderLoading && dataCreateOrder?.orders?.length > 0 ? (
                                    dataCreateOrder?.orders?.map((order: any, i: number) => (
                                        <TableBodyContent key={order?.id || i} index={i} limit={limit} order={order} page={page} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataCreateOrderLoading ? <span className="py-10"><Loading /></span> : <NoData />}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <PaginationWebLayout currentPage={page} totalPages={totalPages}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => setPage(page - 1)}>
                            Sebelumnya
                        </ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => setPage(page + 1)}>
                            Selanjutnya
                        </ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}