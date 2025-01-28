'use client'

import { FaHistory } from "react-icons/fa"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import NoData from "@/components/core/noDataCustom"
import Loading from "@/components/core/loadingCustom"
import ContentWebLayout from "@/components/core/webSessionContent"
import FilterWeb from "@/components/core/filterWeb"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import ButtonCustom from "@/components/core/buttonCustom"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { useWashingHistoryHook } from "@/features/washingWorker/hooks/useWashingHistoryHook"
import HistoryContentMobile from "@/features/washingWorker/components/historyMobileContent"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import HistoryContentWeb from "@/features/washingWorker/components/historyWebContent"
import { IOrderWashing } from "@/features/washingWorker/types/type"

export default function HistoryOrderWashing() {
    const {
        isSearchValues, setIsSearchValues, page, setPage, searchInput, setSearchInput, sortOption, setSortOption, activeTab, setActiveTab, dateFrom, setDateFrom, dateUntil, setDateUntil, refetch,
        debounce, totalPages, limit, dataOrderWashingProcess, dataOrderWashingProcessLoading, dataOrderWashingProcessError
    } = useWashingHistoryHook()
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
                            dataOrderWashingProcess?.orders?.map((order: IOrderWashing) => (
                                <HistoryContentMobile key={order?.id} order={order} />
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
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat"]} />
                        <tbody>
                            {dataOrderWashingProcessLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderWashingProcessLoading && dataOrderWashingProcess?.orders?.length > 0 ? (
                                    dataOrderWashingProcess?.orders?.map((order: IOrderWashing, i: number) => (
                                        <HistoryContentWeb key={order.id} order={order} page={page} limit={limit} i={i} />
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