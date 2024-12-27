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

export default function HistoryOrderWashing() {
    const { page, totalPages, sortOption, dateFrom, dateUntil, limit,
        debounce, setSearchInput, setSortOption, setActiveTab,
        setDateFrom, setDateUntil, dataCreateOrder, dataCreateOrderLoading,
        dataCreateOrderError, setPage } = useNotaOrderHooks()

    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> BUAT NOTA ORDER
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">

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
                                {dataCreateOrderLoading && <p>Loading...</p>}
                                {dataCreateOrderError && <p>Silahkan coba beberapa saat lagi.</p>}
                                {dataCreateOrder?.orders?.map((order: any) => {
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
                                })}

                                <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                            </CardContent>
                        </div>
                    </main>
                </section>
            </main>

            <ContentWebLayout caption='Nota Pesanan'>
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center">
                        <select name="sortNotaOrder"
                            value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                            id="sortNotaOrder" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="name-asc">Sort berdasarkan A - Z</option>
                            <option value="name-desc">Sort berdasarkan Z - A</option>
                            <option value="date-desc">Sort berdasarkan data terbaru</option>
                            <option value="date-asc">Sort berdasarkan data terlama</option>
                            <option value="">Reset</option>
                        </select>
                    </div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeadLayout>
                            <TableHeadNotaOrder />
                        </TableHeadLayout>
                        <tbody>
                            {dataCreateOrder?.orders?.length > 0 ? (
                                dataCreateOrder?.orders?.map((order: any, i: number) => (
                                    <TableBodyContent key={order?.id || i} index={i} limit={limit} order={order} page={page} />
                                ))
                            ) : (<TableBodyNotFound />)}
                        </tbody>
                    </table>
                    <PaginationWebLayout currentPage={page} totalPages={totalPages}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => alert(page - 1)}>
                            Sebelumnya
                        </ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => alert(page + 1)}>
                            Selanjutnya
                        </ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}