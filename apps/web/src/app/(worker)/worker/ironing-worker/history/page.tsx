'use client'

import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import Loading from "@/components/core/loadingCustom"
import NoData from "@/components/core/noDataCustom"
import ContentWebLayout from "@/components/core/webSessionContent"
import FilterWeb from "@/components/core/filterWeb"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import ButtonCustom from "@/components/core/buttonCustom"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { FaGear } from "react-icons/fa6"
import { useIroningHistoryHook } from "@/features/ironingWorker/hooks/useIroningHistoryHook"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import HistoryContentMobile from "@/features/ironingWorker/components/historyMobileContent"
import HistoryContentWeb from "@/features/ironingWorker/components/historyWebContent"
import { IOrderIroning } from "@/features/ironingWorker/types/type"

export default function HistoryOrderIroning() {
    const {
        isSearchValues, setIsSearchValues, page, setPage, searchInput, setSearchInput, sortOption, setSortOption, activeTab, setActiveTab, dateFrom, setDateFrom, dateUntil, setDateUntil, refetch,
        debounce, totalPages, limit, dataOrderIroningProcess, dataOrderIroningProcessLoading, dataOrderIroningProcessError
    } = useIroningHistoryHook()
    return (
        <>
            <ContentMobileLayout title="Riwayat Pesanan" icon={<FaGear className='text-lg' />}>
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

                        dataOrderIroningProcess?.orders?.map((order: IOrderIroning) => (
                            <HistoryContentMobile key={order?.id} order={order} />
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
            </ContentMobileLayout>

            <ContentWebLayout caption='Riwayat Pesanan'>
                <FilterWeb activeTab={activeTab} dateFrom={dateFrom} dateUntil={dateUntil} debounce={debounce} isSearchValues={isSearchValues}
                    setIsSearchValues={setIsSearchValues} searchInput={searchInput} setActiveTab={setActiveTab} setDateFrom={setDateFrom} setDateUntil={setDateUntil}
                    setPage={setPage} setSearchInput={setSearchInput} setSortOption={setSortOption} sortOption={sortOption} borderReset="rounded-full border" options={[
                        { value: 'all', label: 'Semua' }
                    ]} />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat"]} />

                        <tbody>
                            {dataOrderIroningProcessLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderIroningProcessLoading && dataOrderIroningProcess?.orders?.length > 0 ? (
                                    dataOrderIroningProcess?.orders?.map((order: IOrderIroning, i: number) => {
                                        return (
                                            <HistoryContentWeb key={order?.id} order={order} page={page} limit={limit} i={i} />
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderIroningProcessLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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