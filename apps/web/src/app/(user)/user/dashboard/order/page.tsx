'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/buttonCustom";
import NoData from "@/components/core/noDataCustom"
import Loading from "@/components/core/loadingCustom"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { GrNotes } from "react-icons/gr"
import FilterWeb from "@/components/core/filterWeb"
import { useUserOrderHook } from "@/features/user/hooks/useUserOrderHook"
import OrderContentMobile from "@/features/user/components/orderMobileContent"
import OrderContentWeb from "@/features/user/components/orderWebContent"
import OrderPopUpDialog from "@/features/user/components/orderDialogPopUp"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import { IOrderContentMobile } from "./type"

export default function Page() {
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
        debounce, totalPages, limit,
        handleOrderConfirmation,
        handleOrderConfirmationPending,
        handlePageChange,
        handleOrderDetail,
        dataOrderListLoading,
        handleSolveComplaint,
        handleSolveComplaintPending,
        dataOrderList,
        dataOrderListError,
        orderData,
        setOrderData,
        openDialog,
        setOpenDialog,
        entriesPerPage
    } = useUserOrderHook()

    return (
        <>
            <ContentMobileLayout title='Pesanan Saya' icon={<GrNotes className='text-lg' />}>
                <Tabs defaultValue={activeTab} className="pb-28">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="waiting-payment" onClick={() => { setActiveTab("waiting-payment"); setPage(1) }} className='text-xs'>Belum Bayar</TabsTrigger>
                        <TabsTrigger value="complaint" onClick={() => { setActiveTab("complaint"); setPage(1) }} className='text-xs'>Komplain</TabsTrigger>
                        <TabsTrigger value="proses" onClick={() => { setActiveTab("proses"); setPage(1) }} className='text-xs'>Proses</TabsTrigger>
                        <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }} className='text-xs'>Selesai</TabsTrigger>
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
                                isSearchValues={isSearchValues}
                            />
                            {dataOrderListLoading && <Loading />}
                            {dataOrderListError && <div>Silahkan coba beberapa saat lagi.</div>}
                            {!dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                dataOrderList?.orders?.map((order: IOrderContentMobile) => (
                                    <OrderContentMobile
                                        key={order?.id}
                                        order={order}
                                        setOrderData={setOrderData}
                                        handleOrderDetail={handleOrderDetail}
                                        setOpenDialog={setOpenDialog}
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
                <OrderPopUpDialog
                    openDialog={openDialog}
                    orderData={orderData}
                    setOpenDialog={setOpenDialog}
                    router={router}
                    handleOrderConfirmation={handleOrderConfirmation}
                    handleOrderConfirmationPending={handleOrderConfirmationPending}
                    handleSolveComplaint={handleSolveComplaint}
                    handleSolveComplaintPending={handleSolveComplaintPending}
                />
            </ContentMobileLayout>
            <ContentWebLayout caption="Pesanan">
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
                        { value: 'waiting-payment', label: 'Belum Bayar' },
                        { value: 'complaint', label: 'Komplain' },
                        { value: 'proses', label: 'Dalam Proses' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Order ID", "Customer", "Status", "Tipe Layanan", "Action"]} />
                        <tbody>
                            {dataOrderListLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                    dataOrderList?.orders?.map((order: IOrderContentMobile, i: number) => (
                                        <OrderContentWeb
                                            key={order?.id}
                                            order={order}
                                            setOrderData={setOrderData}
                                            handleOrderDetail={handleOrderDetail}
                                            setOpenDialog={setOpenDialog}
                                            i={i}
                                            page={page}
                                            entriesPerPage={entriesPerPage}
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