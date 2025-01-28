'use client'

import Loading from "@/components/core/loadingCustom"
import NoData from "@/components/core/noDataCustom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/buttonCustom";
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"
import FilterWeb from "@/components/core/filterWeb";
import DeliveryContentMobile from "@/features/adminOutlet/components/deliveryMobileContent";
import TableHeaderWeb from "@/components/core/tableHeadWeb";
import DeliveryContentWeb from "@/features/adminOutlet/components/deliveryWebContent";
import { UseAdminOutletDeliveryHook } from "@/features/adminOutlet/hooks/useAdminOutletDeliveryHook";
import { IOrder } from "@/features/adminOutlet/types/type"

export default function DeliveryRequest() {
    const {
        page, setPage,
        searchInput, setSearchInput,
        sortOption, setSortOption,
        activeTab, setActiveTab,
        dateFrom, setDateFrom,
        dateUntil, setDateUntil,
        selectedOrder, setSelectedOrder,
        isSearchValues, setIsSearchValues,
        token, refetch,
        debounce,
        totalPages,
        handleRequestDelivery,
        isPending,
        dataOrderDeliveryLoading,
        dataOrderDeliveryError,
        dataOrderDelivery,
        limit
    } = UseAdminOutletDeliveryHook()
    return (
        <>
            <MobileSessionLayout title="Pengantaran">
                <Tabs defaultValue={activeTab} className="pb-28">
                    <TabsList className="hidden w-full">
                        <TabsTrigger value="ready-to-deliver" onClick={() => { setActiveTab("ready-to-deliver"); setPage(1) }} >Siap Kirim</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab}>
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
                                setPage={setPage}
                                searchInput={searchInput}
                                setIsSearchValues={setIsSearchValues}
                                isSearchValues={isSearchValues}
                            />
                            {dataOrderDeliveryLoading && <Loading />}
                            {dataOrderDeliveryError && <div>Silahkan coba beberapa saat lagi.</div>}
                            {!dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 ? (
                                dataOrderDelivery?.orders?.map((order: IOrder) => (
                                    <DeliveryContentMobile key={order?.id} order={order} handleRequestDelivery={handleRequestDelivery} />
                                ))) : (
                                !dataOrderDeliveryLoading && (
                                    <NoData />
                                ))}
                            {!dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 && (
                                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                            )}
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </MobileSessionLayout>

            <ContentWebLayout caption='Pengiriman'>
                <FilterWeb
                    debounce={debounce}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    dateFrom={dateFrom}
                    dateUntil={dateUntil}
                    setDateFrom={setDateFrom}
                    setDateUntil={setDateUntil}
                    setActiveTab={setActiveTab}
                    setSearchInput={setSearchInput}
                    setPage={setPage}
                    searchInput={searchInput}
                    setIsSearchValues={setIsSearchValues}
                    isSearchValues={isSearchValues}
                    activeTab={activeTab}
                    options={[{ label: 'Siap Kirim', value: 'ready-to-deliver' }]}
                    borderReset="border rounded-full"
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Order ID", "Nama", "Status", "Tipe", "Action"]} />
                        <tbody>
                            {dataOrderDeliveryLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 ? (
                                    dataOrderDelivery?.orders?.map((order: IOrder, i: number) => (
                                        <DeliveryContentWeb key={order?.id} order={order}
                                            handleRequestDelivery={handleRequestDelivery}
                                            page={page} limit={limit} i={i} />
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
                    <div className='flex gap-2 justify-between py-2 px-2 items-center'>
                        <div className="w-1/2 flex">
                            <h1 className="text-neutral-400">Page {page} of {totalPages || '0'}</h1>
                        </div>
                        <div className="flex gap-2">
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                                disabled={page == 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            >Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                                disabled={page == totalPages || page > totalPages} onClick={() => { setPage((prev) => Math.min(prev + 1, totalPages)) }}
                            >Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout>
        </>
    )
}