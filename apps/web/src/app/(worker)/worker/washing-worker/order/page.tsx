'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import FilterWorker from "@/components/core/filterCustom"
import Pagination from "@/components/core/paginationCustom"
import ContentWebLayout from "@/components/core/webSessionContent"
import ButtonCustom from "@/components/core/buttonCustom"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import NoData from "@/components/core/noDataCustom"
import Loading from "@/components/core/loadingCustom"
import FilterWeb from "@/components/core/filterWeb"
import { GrNotes } from "react-icons/gr"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import TableHeaderWeb from "@/components/core/tableHeadWeb"
import { useWashingOrderHook } from "@/features/washingWorker/hooks/useWashingOrderHook"
import WashingContentMobile from "@/features/washingWorker/components/washingMobileContent"
import WashingContentWeb from "@/features/washingWorker/components/washingWebContent"
import { IOrderWashing } from "@/features/washingWorker/types/type"

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
        debounce, totalPages, isFetching, limit,
        dataOrderWashingProcess,
        dataOrderWashingProcessLoading,
        dataOrderWashingProcessError,
        handleProcessWashing,
        isPending
    } = useWashingOrderHook()

    return (
        <>
            <ContentMobileLayout icon={<GrNotes className='text-lg' />} title="Pesanan">
                <div className="pb-28">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} className='text-xs'>Semua</TabsTrigger>
                            <TabsTrigger value="not-washed" onClick={() => { setActiveTab("not-washed"); setPage(1) }} className='text-xs'>Belum Cuci</TabsTrigger>
                            <TabsTrigger value="in-washing" onClick={() => { setActiveTab("in-washing"); setPage(1) }} className='text-xs'>Proses</TabsTrigger>
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
                                {dataOrderWashingProcessLoading && <Loading />}
                                {dataOrderWashingProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                                {!dataOrderWashingProcessLoading && dataOrderWashingProcess?.orders?.length > 0 ? (
                                    dataOrderWashingProcess?.orders?.map((order: IOrderWashing) => (
                                        <WashingContentMobile
                                            key={order?.id}
                                            order={order}
                                            handleProcessWashing={handleProcessWashing}
                                            isPending={isPending}
                                            router={router}
                                        />
                                    ))
                                ) : (
                                    !dataOrderWashingProcessLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderWashingProcessLoading && dataOrderWashingProcess?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}

                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </div>
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
                        { value: 'not-washed', label: 'Belum Dicuci' },
                        { value: 'in-washing', label: 'Proses Cuci' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <TableHeaderWeb columns={["NO", "Nama", "Tipe Order", "Status", "Tanggal dibuat", "Action"]} />
                        <tbody>
                            {dataOrderWashingProcessLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderWashingProcessLoading && dataOrderWashingProcess?.orders?.length > 0 ? (
                                    dataOrderWashingProcess?.orders?.map((order: IOrderWashing, i: number) => (
                                        <WashingContentWeb
                                            key={order?.id}
                                            order={order}
                                            handleProcessWashing={handleProcessWashing}
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
                                            {dataOrderWashingProcessLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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