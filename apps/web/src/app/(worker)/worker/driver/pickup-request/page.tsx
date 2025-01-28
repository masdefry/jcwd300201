'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import ButtonCustom from "@/components/core/buttonCustom"
import { FaBoxOpen } from "react-icons/fa6"
import ContentWebLayout from "@/components/core/webSessionContent"
import Pagination from "@/components/core/paginationCustom"
import FilterWorker from "@/components/core/filterCustom"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import Loading from "@/components/core/loadingCustom"
import NoData from "@/components/core/noDataCustom"
import FilterWeb from "@/components/core/filterWeb"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { usePickupRequestHook } from "@/features/driver/hooks/usePickupRequestHook";
import TableHeaderWeb from "@/components/core/tableHeadWeb";
import PickupContentMobile from "@/features/driver/components/pickupMobileContent";
import PickupContentWeb from "@/features/driver/components/pickupWebContent";
import { IOrderDriver } from "@/features/driver/types/type"

export default function Page() {
    const {
        page, setPage, searchInput, setSearchInput, entriesPerPage, setEntriesPerPage, sortOption, setSortOption, activeTab, setActiveTab, dateFrom, setDateFrom, dateUntil, setDateUntil, dataOrderAwaitingPickup,
        dataOrderAwaitingPickupLoading, dataOrderAwaitingPickupError, handleProcessOrder, handleProcessOrderPending, handleProcessOrderOutlet, handleProcessOrderOutletPending, totalPages, debounce,
        isSearchValues, setIsSearchValues, refetch,
    } = usePickupRequestHook();

    return (
        <>
            <ContentMobileLayout icon={<FaBoxOpen className='text-lg' />} title="Penjemputan">
                <div className="pb-28">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} className='text-xs'>Semua</TabsTrigger>
                            <TabsTrigger value="waiting-pickup" onClick={() => { setActiveTab("waiting-pickup"); setPage(1) }} className='text-xs'>Belum Pickup</TabsTrigger>
                            <TabsTrigger value="process-pickup" onClick={() => { setActiveTab("process-pickup"); setPage(1) }} className='text-xs'>Proses</TabsTrigger>
                            <TabsTrigger value="arrived" onClick={() => { setActiveTab("arrived"); setPage(1) }} className='text-xs'>Selesai</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab}>
                            <CardContent className="space-y-2 pt-2">
                                <FilterWorker
                                    searchInput={searchInput} setPage={setPage} debounce={debounce} sortOption={sortOption}
                                    setSortOption={setSortOption} dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom} setDateUntil={setDateUntil}
                                    setActiveTab={setActiveTab} setSearchInput={setSearchInput} setIsSearchValues={setIsSearchValues} isSearchValues={isSearchValues}
                                />
                                {dataOrderAwaitingPickupLoading && <Loading />}
                                {dataOrderAwaitingPickupError && <p>Silahkan coba beberapa saat lagi.</p>}
                                {!dataOrderAwaitingPickupLoading && dataOrderAwaitingPickup?.orders?.length > 0 ? (
                                    dataOrderAwaitingPickup?.orders?.map((order: IOrderDriver) => (
                                        <PickupContentMobile
                                            key={order?.id}
                                            order={order}
                                            handleProcessOrder={handleProcessOrder}
                                            handleProcessOrderOutlet={handleProcessOrderOutlet}
                                            handleProcessOrderPending={handleProcessOrderPending}
                                            handleProcessOrderOutletPending={handleProcessOrderOutletPending}
                                        />
                                    ))
                                ) : (
                                    !dataOrderAwaitingPickupLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderAwaitingPickupLoading && dataOrderAwaitingPickup?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </div>
            </ContentMobileLayout>

            <ContentWebLayout caption='Permintaan Pesanan'>
                <FilterWeb
                    isSearchValues={isSearchValues} setIsSearchValues={setIsSearchValues} debounce={debounce} sortOption={sortOption} setSortOption={setSortOption} dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom}
                    setDateUntil={setDateUntil} setActiveTab={setActiveTab} setSearchInput={setSearchInput} activeTab={activeTab} setPage={setPage} showStoreSelect={false} searchInput={searchInput} options={[
                        { value: 'all', label: 'Semua' },
                        { value: 'waiting-pickup', label: 'Belum Pickup' }, { value: 'process-pickup', label: 'Proses' }, { value: 'arrived', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat", "Action"]} />
                        <tbody>
                            {dataOrderAwaitingPickupLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderAwaitingPickupLoading && dataOrderAwaitingPickup?.orders?.length > 0 ? (
                                    dataOrderAwaitingPickup?.orders?.map((order: IOrderDriver, i: number) => (
                                        <PickupContentWeb
                                            key={order?.id}
                                            order={order}
                                            handleProcessOrder={handleProcessOrder}
                                            handleProcessOrderOutlet={handleProcessOrderOutlet}
                                            handleProcessOrderPending={handleProcessOrderPending}
                                            handleProcessOrderOutletPending={handleProcessOrderOutletPending}
                                            page={page}
                                            entriesPerPage={entriesPerPage}
                                            refetch={refetch}
                                            i={i}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderAwaitingPickupLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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