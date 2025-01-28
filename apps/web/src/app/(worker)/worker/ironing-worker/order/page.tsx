'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import ButtonCustom from "@/components/core/buttonCustom"
import { FaFileInvoice } from "react-icons/fa6"
import Loading from "@/components/core/loadingCustom"
import NoData from "@/components/core/noDataCustom"
import FilterWeb from "@/components/core/filterWeb"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { useIroningOrderHook } from "@/features/ironingWorker/hooks/useIroningOrderHook"
import IroningContentMobile from "@/features/ironingWorker/components/ironingMobileContent"
import IroningContentWeb from "@/features/ironingWorker/components/ironingWebContent"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import { IOrderIroning } from "@/features/ironingWorker/types/type"

export default function IroningOrder() {
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
        dataOrderIroningProcess,
        dataOrderIroningProcessLoading,
        dataOrderIroningProcessError,
        handleProcessIroning,
        isPending
    } = useIroningOrderHook()
    return (
        <>
            <ContentMobileLayout title="Pesanan" icon={<FaFileInvoice className='text-lg' />}>
                <Tabs defaultValue={activeTab} className="fit pb-28">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} className="text-xs">Semua</TabsTrigger>
                        <TabsTrigger value="belum-disetrika" onClick={() => { setActiveTab("belum-disetrika"); setPage(1) }} className="text-xs">Belum Setrika</TabsTrigger>
                        <TabsTrigger value="proses-setrika" onClick={() => { setActiveTab("proses-setrika"); setPage(1) }} className="text-xs">Proses</TabsTrigger>
                        <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }} className="text-xs">Selesai</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab}>
                        <CardContent className="space-y-2 pt-2">
                            <FilterWorker searchInput={searchInput} setPage={setPage} debounce={debounce} sortOption={sortOption}
                                setSortOption={setSortOption} dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom}
                                setDateUntil={setDateUntil} setActiveTab={setActiveTab} setSearchInput={setSearchInput}
                                setIsSearchValues={setIsSearchValues} isSearchValues={isSearchValues} />
                            {dataOrderIroningProcessLoading && <Loading />}
                            {dataOrderIroningProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                            {!dataOrderIroningProcessLoading && dataOrderIroningProcess?.orders?.length > 0 ? (
                                dataOrderIroningProcess?.orders?.map((order: IOrderIroning) => (
                                    <IroningContentMobile
                                        key={order?.id}
                                        order={order}
                                        handleProcessIroning={handleProcessIroning}
                                        isPending={isPending}
                                        router={router}
                                    />
                                ))
                            ) : (
                                !dataOrderIroningProcessLoading && (
                                    <NoData />
                                )

                            )}
                            {!dataOrderIroningProcessLoading && dataOrderIroningProcess?.orders?.length > 0 && (
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
                        { value: 'belum-disetrika', label: 'Belum Setrika' },
                        { value: 'proses-setrika', label: 'Proses Setrika' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat", "Action"]} />
                        <tbody>
                            {dataOrderIroningProcessLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderIroningProcessLoading && dataOrderIroningProcess?.orders?.length > 0 ? (
                                    dataOrderIroningProcess?.orders?.map((order: IOrderIroning, i: number) => {
                                        return (
                                            <IroningContentWeb
                                                key={order?.id}
                                                order={order}
                                                handleProcessIroning={handleProcessIroning}
                                                isPending={isPending}
                                                router={router}
                                                limit={limit}
                                                i={i}
                                                page={page}
                                            />
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderIroningProcessLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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