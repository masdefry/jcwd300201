'use client'

import { FaHistory } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import ButtonCustom from "@/components/core/buttonCustom"
import NoData from "@/components/core/noDataCustom"
import Loading from "@/components/core/loadingCustom"
import FilterWeb from "@/components/core/filterWeb"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { useDriverHistoryHook } from "@/features/driver/hooks/useDriverHistoryHook"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import HistoryContentMobile from "@/features/driver/components/historyMobileContent"
import HistoryContentWeb from "@/features/driver/components/historyWebContent"
import { IOrderDriver } from "@/features/driver/types/type"

export default function HistoryOrderDriver() {
    const {
        isSearchValues, setIsSearchValues, page, setPage, searchInput, setSearchInput, sortOption, setSortOption, activeTab, setActiveTab, dateFrom, setDateFrom, dateUntil, setDateUntil, dataHistoryOrder, refetch, dataHistoryOrderLoading,
        debounce, totalPages, dataHistoryOrderError, limit
    } = useDriverHistoryHook()
    return (
        <>
            <ContentMobileLayout icon={<FaHistory className='text-lg' />} title="Riwayat">
                <div className="pb-28">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pickup" onClick={() => { setActiveTab("pickup"); setPage(1) }} className='text-xs'>Pickup</TabsTrigger>
                            <TabsTrigger value="delivery" onClick={() => { setActiveTab("delivery"); setPage(1) }} className='text-xs'>Delivery</TabsTrigger>
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
                                    setIsSearchValues={setIsSearchValues}
                                    isSearchValues={isSearchValues}

                                />
                                {dataHistoryOrderLoading && <Loading />}
                                {dataHistoryOrderError && <p>Silahkan coba beberapa saat lagi.</p>}
                                {!dataHistoryOrderLoading && dataHistoryOrder?.orders?.length > 0 ? (
                                    dataHistoryOrder?.orders?.map((order: IOrderDriver) => (
                                        <HistoryContentMobile key={order?.id} order={order} />
                                    ))
                                ) : (
                                    !dataHistoryOrderLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataHistoryOrderLoading && dataHistoryOrder?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </div>
            </ContentMobileLayout>

            <ContentWebLayout caption='Riwayat Penjemputan'>
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
                    options={[
                        { value: 'pickup', label: 'Pickup' },
                        { value: 'delivery', label: 'Delivery' },
                    ]}
                    borderReset="border rounded-full"
                />


                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat"]} />
                        <tbody>
                            {dataHistoryOrderLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataHistoryOrderLoading && dataHistoryOrder?.orders?.length > 0 ? (
                                    dataHistoryOrder?.orders?.map((order: IOrderDriver, i: number) => (
                                        <HistoryContentWeb key={order.id} order={order} page={page} limit={limit} i={i} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataHistoryOrderLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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