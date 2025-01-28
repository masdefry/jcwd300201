'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/buttonCustom";
import NoData from "@/components/core/noDataCustom"
import Loading from "@/components/core/loadingCustom"
import FilterWeb from "@/components/core/filterWeb"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"
import { useAdminOutletPaymentHook } from "@/features/adminOutlet/hooks/useAdminOutletPaymentHook"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import PaymentContentMobile from "@/features/adminOutlet/components/paymentMobileContent"
import PaymentContentWeb from "@/features/adminOutlet/components/paymentWebContent"
import { IOrder } from "@/features/adminOutlet/types/type"


export default function DeliveryRequest() {
    const {
        isSearchValues, setIsSearchValues, page, setPage, searchInput, setSearchInput, sortOption, setSortOption,
        activeTab, setActiveTab, dateFrom, setDateFrom, dateUntil, setDateUntil, debounce, totalPages, isFetching,
        dataOrderListLoading, dataOrderListError, dataOrderList,
        handlePageChange, entriesPerPage, handleConfirmPayment, handlConfirmPaymentPending,
        imageLoading, setImageLoading, getDataItem
    } = useAdminOutletPaymentHook()

    return (
        <>
            <MobileSessionLayout title="Pembayaran">
                <div className="pb-28">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="verification" onClick={() => { setActiveTab("verification"); setPage(1) }} >Verifikasi</TabsTrigger>
                            <TabsTrigger value="waiting-payment" onClick={() => { setActiveTab("waiting-payment"); setPage(1) }} >Belum Bayar</TabsTrigger>
                            <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }} >Selesai</TabsTrigger>
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
                                {dataOrderListLoading && <Loading />}
                                {dataOrderListError && <div>Silahkan coba beberapa saat lagi.</div>}
                                {!dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                    dataOrderList?.orders?.map((order: IOrder) => (
                                        <PaymentContentMobile
                                            key={order?.id} order={order} imageLoading={imageLoading} setImageLoading={setImageLoading} handlConfirmPaymentPending={handlConfirmPaymentPending} handleConfirmPayment={handleConfirmPayment}
                                        />
                                    ))
                                ) : (
                                    !dataOrderListLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderListLoading && dataOrderList?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}
                            </CardContent>
                        </TabsContent>
                    </Tabs>

                </div>
            </MobileSessionLayout >

            <ContentWebLayout caption="Pembayaran">
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
                        { value: 'verification', label: 'Verifikasi' },
                        { value: 'waiting-payment', label: 'Belum Bayar' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />
                {/* table */}
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Order ID", "Nama", "Total", "Tipe", "Action"]} />
                        <tbody>

                            {dataOrderListLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderListLoading && getDataItem?.length > 0 ? (
                                    getDataItem?.map((order: IOrder, i: number) => (
                                        <PaymentContentWeb
                                            key={order?.id} order={order} page={page} handleConfirmPayment={handleConfirmPayment} i={i} entriesPerPage={entriesPerPage} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderListLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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
                                disabled={page == 1} onClick={() => handlePageChange(page - 1)}
                            >Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                                disabled={page == totalPages || page > totalPages} onClick={() => handlePageChange(page + 1)}
                            >Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout>
        </>
    )
}