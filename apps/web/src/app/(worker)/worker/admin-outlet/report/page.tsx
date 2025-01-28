'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import Loading from "@/components/core/loadingCustom"
import NoData from "@/components/core/noDataCustom"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"
import ContentWebLayout from "@/components/core/webSessionContent"
import FilterWeb from "@/components/core/filterWeb"
import ButtonCustom from "@/components/core/buttonCustom"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import ReportContentMobile from "@/features/adminOutlet/components/reportMobileContent"
import ReportContentWeb from "@/features/adminOutlet/components/reportWebContent"
import { useAdminOutletReportHook } from "@/features/adminOutlet/hooks/useAdminOutletReportHook"
import { IOrder } from "@/features/adminOutlet/types/type"

export default function DriverPickUp() {
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
        handlePageChange,
        dataOrderPackingProcess,
        dataOrderPackingProcessLoading,
        dataOrderPackingProcessError,
        handleLaundryProblem,
        isPending,
        isDisableSuccess
    } = useAdminOutletReportHook()

    return (
        <>
            <MobileSessionLayout title="Laporan Pesanan">
                <div className="space-y-4 pb-28">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="bermasalah" onClick={() => { setActiveTab("bermasalah"); setPage(1) }} >Bermasalah</TabsTrigger>
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
                                    isSearchValues={isSearchValues}

                                />
                                {dataOrderPackingProcessLoading && <Loading />}
                                {dataOrderPackingProcessError && <div>Silahkan coba beberapa saat lagi.</div>}
                                {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                                    dataOrderPackingProcess?.orders?.map((order: IOrder) => (
                                        <ReportContentMobile
                                            key={order?.id} order={order} handleLaundryProblem={handleLaundryProblem} isPending={isPending} isDisableSuccess={isDisableSuccess}
                                        />
                                    ))
                                ) : (
                                    !dataOrderPackingProcessLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Laporan Pesanan">
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
                    searchInput={searchInput}
                    setPage={setPage}
                    setIsSearchValues={setIsSearchValues}
                    isSearchValues={isSearchValues}
                    activeTab={activeTab}
                    borderReset="border rounded-full"
                    options={[
                        { label: 'Bermasalah', value: 'bermasalah' },
                        { label: 'Selesai', value: 'done' },
                    ]}
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Order ID", "Customer", "Status", "Action"]} />
                        <tbody>
                            {dataOrderPackingProcessLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                                    dataOrderPackingProcess?.orders?.map((order: IOrder, i: number) => (
                                        <ReportContentWeb
                                            key={order?.id} order={order} handleLaundryProblem={handleLaundryProblem} isPending={isPending} isDisableSuccess={isDisableSuccess} page={page} i={i}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderPackingProcessLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => handlePageChange(page - 1)}>Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => handlePageChange(page + 1)}>Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout>
        </>
    )
}