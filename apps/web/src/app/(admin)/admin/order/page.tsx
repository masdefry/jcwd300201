'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAdminOrderHook } from "@/features/superAdmin/hooks/useAdminOrderHook"
import { FaMoneyBillWave } from "react-icons/fa"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import FilterWorker from "@/components/core/filterCustom"
import Loading from "@/components/core/loadingCustom"
import OrderContentAdminMobile from "@/features/superAdmin/components/orderContentAdminMob"
import NoData from "@/components/core/noDataCustom"
import Pagination from "@/components/core/paginationCustom"
import { IOrder } from "./type"
import OrderDialogAdmin from "@/features/superAdmin/components/orderAdminDialog"
import ContentWebLayout from "@/components/core/webSessionContent"
import FilterWeb from "@/components/core/filterWeb"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import OrderContentWeb from "@/features/superAdmin/components/orderWebContentAdmin"
import ButtonCustom from "@/components/core/buttonCustom"
// import ContentWebLayout from "@/components/core/webSessionContent";
// import ButtonCustom from "@/components/core/Button";
// import NoData from "@/components/core/noData"
// import Loading from "@/components/core/loading"
// import FilterWeb from "@/components/core/filterWeb"
// import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
// import { FaMoneyBillWave } from "react-icons/fa6"
// import { useAdminOrderHook } from "@/features/superAdmin/hooks/useAdminOrderHook"
// import OrderContentAdminMobile from "@/features/superAdmin/components/orderContentAdminMobile"
// import OrderDialogAdmin from "@/features/superAdmin/components/orderDialogAdmin"
// import OrderContentWeb from "@/features/superAdmin/components/orderContentAdminWeb"
// import TableHeaderWeb from "@/components/core/tableHeadWeb"
// import { IOrder } from "./type"

export default function OrderList() {
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
        handleOrderDetail,
        getDataStore,
        isStoreLoading,
        isStoreError,
        openDialog, setOpenDialog,
        orderData, dataOrderListLoading, dataOrderListError, dataOrderList,
        setOrderData, handlePageChange, entriesPerPage, outletId, setOutletId
    } = useAdminOrderHook()

    return (
        <>
            <ContentMobileLayout title="Pesanan" icon={<FaMoneyBillWave className='text-lg' />}>
                <Tabs defaultValue={activeTab} className="fit pb-24">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="proses" onClick={() => { setActiveTab("proses"); setPage(1) }} >Proses</TabsTrigger>
                        <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }} >Selesai</TabsTrigger>
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
                                searchInput={searchInput}
                                setPage={setPage}
                                setIsSearchValues={setIsSearchValues}
                                isSearchValues={isSearchValues} />
                            {dataOrderListLoading && <Loading />}
                            {dataOrderListError && <div>Silahkan coba beberapa saat lagi.</div>}
                            {!dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                dataOrderList?.orders?.map((order: IOrder) => (
                                    <OrderContentAdminMobile key={order?.id} order={order} setOrderData={setOrderData} handleOrderDetail={handleOrderDetail} setOpenDialog={setOpenDialog} />
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
                <Dialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Detail Order</DialogTitle>
                        </DialogHeader>
                        {orderData ? (
                            <OrderDialogAdmin orderData={orderData} />
                        ) : (
                            <Loading />
                        )}
                    </DialogContent>
                </Dialog>
            </ContentMobileLayout>

            <ContentWebLayout caption="Order">
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
                    outletId={outletId}
                    setOutletId={setOutletId}
                    getDataStore={getDataStore}
                    isStoreLoading={isStoreLoading}
                    isStoreError={isStoreError}
                    setPage={setPage}
                    showStoreSelect={true}
                    searchInput={searchInput}
                    options={[
                        { value: 'proses', label: 'Dalam Proses' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />

                {/* table */}
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Order ID", "Customer", "Status", "Store", "Action"]} />
                        <tbody>

                            {dataOrderListLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                    dataOrderList?.orders?.map((order: IOrder, i: number) => (
                                        <OrderContentWeb
                                            key={order?.id}
                                            order={order}
                                            setOrderData={setOrderData}
                                            page={page} handleOrderDetail={handleOrderDetail} i={i} setOpenDialog={setOpenDialog} entriesPerPage={entriesPerPage}
                                        />
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