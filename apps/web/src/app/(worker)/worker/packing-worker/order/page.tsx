'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent"
import ButtonCustom from "@/components/core/buttonCustom"
import { FaCartArrowDown } from "react-icons/fa6"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import NoData from "@/components/core/noDataCustom"
import FilterWeb from "@/components/core/filterWeb"
import Loading from "@/components/core/loadingCustom"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { usePackingOrderHook } from "@/features/packingWorker/hooks/usePackingOrderHook"
import PackingContentMobile from "@/features/packingWorker/components/packingMobileContent"
import PackingContentWeb from "@/features/packingWorker/components/packingWebContent"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import { IOrderPacking } from "@/features/packingWorker/types/type"

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
        debounce, totalPages, isFetching, limit,
        dataOrderPackingProcess,
        dataOrderPackingProcessLoading,
        dataOrderPackingProcessError,
        handleProcessPacking,
        isPending
    } = usePackingOrderHook()

    return (
        <>
            <ContentMobileLayout icon={<FaCartArrowDown className='text-lg' />} title="Pesanan">
                <Tabs defaultValue={activeTab} className="fit">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} className='text-xs'>Semua</TabsTrigger>
                        <TabsTrigger value="not-packed-yet" onClick={() => { setActiveTab("not-packed-yet"); setPage(1) }} className='text-xs'>Belum Packing</TabsTrigger>
                        <TabsTrigger value="packing-process" onClick={() => { setActiveTab("packing-process"); setPage(1) }} className='text-xs'>Proses</TabsTrigger>
                        <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }} className='text-xs'>Selesai</TabsTrigger>
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
                            {dataOrderPackingProcessLoading && <Loading />}
                            {dataOrderPackingProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                            {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                                dataOrderPackingProcess?.orders?.map((order: IOrderPacking) => (
                                    <PackingContentMobile
                                        key={order?.id}
                                        order={order}
                                        handleProcessPacking={handleProcessPacking}
                                        isPending={isPending}
                                        router={router}
                                    />
                                ))
                            ) : (
                                !dataOrderPackingProcessLoading && (
                                    <NoData />
                                ))}
                            {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 && (
                                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                            )}
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </ContentMobileLayout>

            <ContentWebLayout caption='Pesanan'>
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
                        { value: 'all', label: 'Semua' },
                        { value: 'not-packed-yet', label: 'Belum Packing' },
                        { value: 'packing-process', label: 'Proses Packing' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat", "Action"]} />
                        <tbody>
                            {dataOrderPackingProcessLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                                    dataOrderPackingProcess?.orders?.map((order: IOrderPacking, i: number) => (
                                        <PackingContentWeb
                                            key={order?.id}
                                            order={order}
                                            handleProcessPacking={handleProcessPacking}
                                            isPending={isPending}
                                            router={router}
                                            limit={limit}
                                            i={i}
                                            page={page}
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
                    <PaginationWebLayout currentPage={page} totalPages={totalPages || '1'}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Sebelumnya</ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => { setPage((prev) => Math.min(prev + 1, totalPages)) }}>Selanjutnya</ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}