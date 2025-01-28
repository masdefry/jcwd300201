'use client'

import { FaHistory } from "react-icons/fa"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import ButtonCustom from "@/components/core/buttonCustom"
import Loading from "@/components/core/loadingCustom"
import NoData from "@/components/core/noDataCustom"
import FilterWeb from "@/components/core/filterWeb"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { usePackingHistoryHook } from "@/features/packingWorker/hooks/usePackingHistoryHook"
import HistoryContentMobile from "@/features/packingWorker/components/historyMobileContent"
import HistoryContentWeb from "@/features/packingWorker/components/historyWebContent"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import { IOrderPacking } from "@/features/packingWorker/types/type"

export default function HistoryOrderPacking() {
    const {
        params,
        router,
        pathname,
        token,
        isSearchValues,
        setIsSearchValues,
        page,
        setPage,
        searchInput, setSearchInput,
        sortOption, setSortOption,
        activeTab, setActiveTab,
        dateFrom, setDateFrom,
        dateUntil, setDateUntil,
        refetch,
        debounce, totalPages, isFetching, limit,
        dataOrderPackingProcess,
        dataOrderPackingProcessLoading,
        dataOrderPackingProcessError
    } = usePackingHistoryHook()

    console.log(dataOrderPackingProcess)

    return (
        <>
            <ContentMobileLayout icon={<FaHistory className="text-lg" />} title="Riwayat">
                <CardContent className="space-y-2 pb-28">
                    <FilterWorker searchInput={searchInput} setPage={setPage} debounce={debounce} sortOption={sortOption} setSortOption={setSortOption}
                        dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom} setDateUntil={setDateUntil} setActiveTab={setActiveTab} setSearchInput={setSearchInput}
                        setIsSearchValues={setIsSearchValues} isSearchValues={isSearchValues} />
                    {dataOrderPackingProcessLoading && <Loading />}
                    {dataOrderPackingProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                    {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                        dataOrderPackingProcess?.orders?.map((order: IOrderPacking) => (
                            <HistoryContentMobile key={order?.id} order={order} />
                        ))) : (
                        !dataOrderPackingProcessLoading && (
                            <NoData />
                        ))}
                    {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 && (
                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                    )}
                </CardContent>
            </ContentMobileLayout>

            <ContentWebLayout caption='Riwayat'>
                <FilterWeb isSearchValues={isSearchValues} setIsSearchValues={setIsSearchValues}
                    debounce={debounce} sortOption={sortOption} setSortOption={setSortOption} dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom} setDateUntil={setDateUntil} setActiveTab={setActiveTab} setSearchInput={setSearchInput} activeTab={activeTab} setPage={setPage} showStoreSelect={false}
                    searchInput={searchInput} showTabOption={false} borderReset="border rounded-full" />
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat"]} />
                        <tbody>
                            {isFetching ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                                    dataOrderPackingProcess?.orders?.map((order: IOrderPacking, i: number) => (
                                        <HistoryContentWeb key={order?.id} order={order} page={page} limit={limit} i={i} />
                                    ))) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderPackingProcessLoading ? <span className="py-10"><Loading /></span> : <NoData />}
                                        </td>
                                    </tr>
                                ))}
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