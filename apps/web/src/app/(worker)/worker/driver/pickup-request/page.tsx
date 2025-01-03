'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import { instance } from "@/utils/axiosInstance"
import authStore from "@/zustand/authstore"
import { useState, useEffect, ChangeEvent } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/hooks/use-toast"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import { IoLocationSharp } from "react-icons/io5";
import ButtonCustom from "@/components/core/button"
import SearchInputCustom from "@/components/core/searchBar"
import { FaBoxOpen, FaPlus } from "react-icons/fa6"
import ContentWebLayout from "@/components/core/webSessionContent"
import Pagination from "@/components/core/pagination"
import FilterWorker from "@/components/core/filter"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import Loading from "@/components/core/loading"
import NoData from "@/components/core/noData"
import FilterWeb from "@/components/core/filterWeb"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"

export default function Page() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const [page, setPage] = useState<number>(1)
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "all");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [isSearchValues, setIsSearchValues] = useState<string>('')

    const limit = 5;

    const { data: dataOrderAwaitingPickup, isFetching, refetch, isLoading: dataOrderAwaitingPickupLoading, isError: dataOrderAwaitingPickupError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const tabValue =
                activeTab === "waiting-pickup" ? "AWAITING_DRIVER_PICKUP" :
                    activeTab === "process-pickup" ? "DRIVER_TO_OUTLET" :
                        activeTab === "arrived" ? "DRIVER_ARRIVED_AT_OUTLET" : "";

            const res = await instance.get('/order/order', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: tabValue,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res)
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessOrder, isPending: handleProcessOrderPending } = useMutation({
        mutationFn: async (slug: any) => {
            return await instance.post(`/order/accept-order/${slug}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: any) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            refetch()
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })
    const { mutate: handleProcessOrderOutlet, isPending: handleProcessOrderOutletPending } = useMutation({
        mutationFn: async (slug: any) => {
            return await instance.post(`/order/accept-outlet/${slug}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: any) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            refetch()
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })


    const debounce = useDebouncedCallback(values => {
        setSearchInput(values)
        setPage(1)
    }, 500);

    const totalPages = dataOrderAwaitingPickup?.totalPage || 1

    useEffect(() => {
        const currentUrl = new URLSearchParams(params.toString());
        if (searchInput) {
            currentUrl.set(`search`, searchInput)
        } else {
            currentUrl.delete(`search`)
        }
        if (sortOption) {
            currentUrl.set("sort", sortOption);
        } else {
            currentUrl.delete(`sort`)
        }
        if (activeTab) {
            currentUrl.set("tab", activeTab);
        } else {
            currentUrl.delete(`tab`)
        }
        if (dateFrom) {
            currentUrl.set('date-from', dateFrom?.toString())
        } else {
            currentUrl.delete('date-from')
        }
        if (dateUntil) {
            currentUrl.set('date-until', dateUntil?.toString())
        } else {
            currentUrl.delete('date-until')
        }
        if (page) {
            currentUrl.set('page', page?.toString())
        } else {
            currentUrl.delete('page')
        }
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, refetch, dateFrom, dateUntil]);



    return (
        <>
            <ContentMobileLayout icon={<FaBoxOpen className='text-lg' />} title="Permintaan Pickup">
                <div className="pb-24">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} className='text-xs'>Semua</TabsTrigger>
                            <TabsTrigger value="waiting-pickup" onClick={() => { setActiveTab("waiting-pickup"); setPage(1) }} className='text-xs'>Belum ..</TabsTrigger>
                            <TabsTrigger value="process-pickup" onClick={() => { setActiveTab("process-pickup"); setPage(1) }} className='text-xs'>Proses</TabsTrigger>
                            <TabsTrigger value="arrived" onClick={() => { setActiveTab("arrived"); setPage(1) }} className='text-xs'>Selesai</TabsTrigger>
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
                                {dataOrderAwaitingPickupLoading && <Loading />}
                                {dataOrderAwaitingPickupError && <p>Silahkan coba beberapa saat lagi.</p>}
                                {!dataOrderAwaitingPickupLoading && dataOrderAwaitingPickup?.orders?.length > 0 ? (
                                    dataOrderAwaitingPickup?.orders?.map((order: any) => (
                                        <section key={order.id} className="flex justify-between items-center border-b py-4">
                                            <ConfirmAlert
                                                colorConfirmation="blue"
                                                caption={
                                                    order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                        ? 'Apakah anda yakin ingin melakukan pengambilan laundry pada order ini?'
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                                                            ? 'Apakah anda yakin ingin menyelesaikan pengiriman laundry pada order ini?'
                                                            : ''
                                                }
                                                onClick={
                                                    order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                        ? () => handleProcessOrder(order?.id)
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                                                            ? () => handleProcessOrderOutlet(order?.id)
                                                            : () => { }
                                                } description={
                                                    order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                        ? 'Konfirmasi bahwa Anda akan mengambil laundry untuk order ini'
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                                                            ? 'Konfirmasi bahwa barang untuk order ini telah berhasil diantar ke laundry'
                                                            : ''
                                                } disabled={
                                                    (order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' && handleProcessOrderPending) ||
                                                    (order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' && handleProcessOrderOutletPending)
                                                }>
                                                <div className="flex items-center">
                                                    <div className="px-2">
                                                        <h2 className="font-medium text-gray-900">{order?.id?.length > 15 ? <span>{order?.id?.slice(0, 15)}..</span> : order?.id}</h2>
                                                        <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                                                        <p className="text-xs text-gray-500">
                                                            {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                                                                order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                                                    order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                                                        order?.orderStatus[0]?.status}</p>
                                                        <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                                    </div>
                                                </div>
                                            </ConfirmAlert>

                                            <div className="flex gap-1">
                                                <Link href={`https://www.google.com/maps/search/?api=1&query=${order?.UserAddress?.latitude},${order?.UserAddress?.longitude}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <IoLocationSharp />
                                                </Link>

                                                <Link href={`https://wa.me/62${order.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                                    <FaWhatsapp />
                                                </Link>
                                            </div>
                                        </section>
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

            {/* web ssi */}
            <ContentWebLayout caption='Permintaan Pesanan'>
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
                        { value: 'waiting-pickup', label: 'Belum Pickup' },
                        { value: 'process-pickup', label: 'Proses' },
                        { value: 'arrived', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tipe Order</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tanggal dibuat</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isFetching ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderAwaitingPickupLoading && dataOrderAwaitingPickup?.orders?.length > 0 ? (
                                    dataOrderAwaitingPickup?.orders?.map((order: any, i: number) => (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Strika' : 'Layanan Laundry'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                                                    order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                                        order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                                            order?.orderStatus[0]?.status}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
                                            <td className="py-4 px-6 hover:underline break-words">
                                                <ConfirmAlert
                                                    disabled={
                                                        (order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' && handleProcessOrderPending) ||
                                                        (order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' && handleProcessOrderOutletPending)
                                                    }
                                                    colorConfirmation="blue" caption={order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                        ? 'Apakah anda yakin ingin melakukan pengambilan laundry pada order ini?'
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                                                            ? 'Apakah anda yakin ingin menyelesaikan pengiriman laundry pada order ini?'
                                                            : ''}
                                                    onClick={order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? () => {
                                                        handleProcessOrder(order?.id)
                                                        refetch()
                                                    }
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? () => {
                                                            handleProcessOrderOutlet(order?.id)
                                                            refetch()
                                                        } : () => console.log('trigger')
                                                    }
                                                    description={order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Konfirmasi bahwa Anda akan mengambil laundry untuk order ini'
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Konfirmasi bahwa barang untuk order ini telah berhasil diantar ke laundry'
                                                            : ''
                                                    }
                                                >
                                                    <button className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500' disabled={order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? true : false}>{order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Pickup' : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Selesaikan' :
                                                        order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Selesai' : 'Selesai'}</button>
                                                </ConfirmAlert>
                                            </td>
                                        </tr>
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