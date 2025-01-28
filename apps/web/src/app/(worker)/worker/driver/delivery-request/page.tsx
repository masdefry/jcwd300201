'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import ButtonCustom from "@/components/core/buttonCustom"
import { FaTruck } from "react-icons/fa6"
import ContentWebLayout from "@/components/core/webSessionContent"
import Pagination from "@/components/core/paginationCustom"
import FilterWorker from "@/components/core/filterCustom"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import Loading from "@/components/core/loadingCustom"
import NoData from "@/components/core/noDataCustom"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import FilterWeb from "@/components/core/filterWeb"
import { useDeliveryRequestHook } from "@/features/driver/hooks/useDeliveryRequestHook"
import TableHeaderWeb from "@/components/core/tableHeadWeb";
import DeliveryContentMobile from "@/features/driver/components/deliveryMobileContent";
import DeliveryContentWeb from "@/features/driver/components/deliveryWebContent";
import { IOrderDriver } from "@/features/driver/types/type"

export default function DriverDelivery() {
    const { dataOrderDelivery, isFetching, dataOrderDeliveryLoading, dataOrderDeliveryError, handleProcessDelivery, handleAcceptOrderDelivery, debounce,
        handleProcessDeliveryPending, handleAcceptOrderDeliveryPending, searchInput, page, setSearchInput, setPage, setSortOption, setActiveTab, activeTab,
        sortOption, dateFrom, dateUntil, setDateFrom, setDateUntil, setIsSearchValues, isSearchValues, limit, totalPages } = useDeliveryRequestHook()

    return (
        <>
            <ContentMobileLayout icon={<FaTruck className="text-lg" />} title="Pengantaran">
                <div className="pb-28">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} className='text-xs'>Semua</TabsTrigger>
                            <TabsTrigger value="waiting-driver" onClick={() => { setActiveTab("waiting-driver"); setPage(1) }} className='text-xs'>Belum Dijemput</TabsTrigger>
                            <TabsTrigger value="proses" onClick={() => { setActiveTab("proses"); setPage(1) }} className='text-xs'>Proses</TabsTrigger>
                            <TabsTrigger value="terkirim" onClick={() => { setActiveTab("terkirim"); setPage(1) }} className='text-xs'>Terkirim</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab}>
                            <CardContent className="space-y-2 pt-2">
                                <FilterWorker
                                    setPage={setPage} searchInput={searchInput} debounce={debounce} sortOption={sortOption} setSortOption={setSortOption} dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom}
                                    setDateUntil={setDateUntil} setActiveTab={setActiveTab} setSearchInput={setSearchInput} setIsSearchValues={setIsSearchValues} isSearchValues={isSearchValues}
                                />
                                {dataOrderDeliveryLoading && <Loading />}
                                {dataOrderDeliveryError && <div>Silahkan coba beberapa saat lagi.</div>}
                                {!dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 ? (
                                    dataOrderDelivery?.orders?.map((order: IOrderDriver) => (
                                        <DeliveryContentMobile
                                            key={order.id}
                                            order={order}
                                            handleProcessDelivery={handleProcessDelivery}
                                            handleAcceptOrderDelivery={handleAcceptOrderDelivery}
                                            handleProcessDeliveryPending={handleProcessDeliveryPending}
                                            handleAcceptOrderDeliveryPending={handleAcceptOrderDeliveryPending}
                                        />
                                    ))
                                ) : (
                                    !dataOrderDeliveryLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </div>
            </ContentMobileLayout>

            <ContentWebLayout caption='Pengiriman'>
                <FilterWeb
                    isSearchValues={isSearchValues} setIsSearchValues={setIsSearchValues} debounce={debounce} sortOption={sortOption} setSortOption={setSortOption} dateFrom={dateFrom} dateUntil={dateUntil}
                    setDateFrom={setDateFrom} setDateUntil={setDateUntil} setActiveTab={setActiveTab} setSearchInput={setSearchInput} activeTab={activeTab} setPage={setPage} showStoreSelect={false} searchInput={searchInput}
                    options={[{ value: 'all', label: 'Semua' }, { value: 'waiting-driver', label: 'Belum Dijemput' }, { value: 'proses', label: 'Proses' }, { value: 'terkirim', label: 'Terkirim' },]}
                    borderReset="border rounded-full"
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat", "Action"]} />
                        <tbody>
                            {dataOrderDeliveryLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 ? (
                                    dataOrderDelivery?.orders?.map((order: IOrderDriver, i: number) => (
                                        <DeliveryContentWeb
                                            key={order.id}
                                            order={order}
                                            handleProcessDelivery={handleProcessDelivery}
                                            handleAcceptOrderDelivery={handleAcceptOrderDelivery}
                                            handleProcessDeliveryPending={handleProcessDeliveryPending}
                                            handleAcceptOrderDeliveryPending={handleAcceptOrderDeliveryPending}
                                            page={page}
                                            limit={limit}
                                            i={i}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderDeliveryLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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