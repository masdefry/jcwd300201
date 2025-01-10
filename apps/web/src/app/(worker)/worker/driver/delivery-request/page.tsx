'use client'

import Link from "next/link"
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
import ButtonCustom from "@/components/core/button"
import SearchInputCustom from "@/components/core/searchBar"
import { FaPlus, FaTruck } from "react-icons/fa6"
import ContentWebLayout from "@/components/core/webSessionContent"
import Pagination from "@/components/core/pagination"
import FilterWorker from "@/components/core/filter"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import Loading from "@/components/core/loading"
import NoData from "@/components/core/noData"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import FilterWeb from "@/components/core/filterWeb"

export default function DriverDelivery() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "all");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [isSearchValues, setIsSearchValues] = useState<string>('')


    const limit = 5;

    const { data: dataOrderDelivery, isFetching, refetch, isLoading: dataOrderDeliveryLoading, isError: dataOrderDeliveryError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get(`/order/delivery`, {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: activeTab,
                    dateFrom,
                    dateUntil,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res)
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessDelivery, isPending: handleProcessDeliveryPending } = useMutation({
        mutationFn: async (orderId: any) => {
            return await instance.post(`/order/delivery-process/${orderId}`, { email }, {
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

    const { mutate: handleAcceptOrderDelivery, isPending: handleAcceptOrderDeliveryPending } = useMutation({
        mutationFn: async (orderId: any) => {
            return await instance.post(`/order/delivery-accept/${orderId}`, { email }, {
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
    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderDelivery?.totalPage || 1;

    return (
        <>
            <ContentMobileLayout icon={<FaTruck className="text-lg" />} title="Pengantaran">
                <div className="pb-28">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} className='text-xs'>Semua</TabsTrigger>
                            <TabsTrigger value="waiting-driver" onClick={() => { setActiveTab("waiting-driver"); setPage(1) }} className='text-xs'>Belum Dijemput</TabsTrigger>
                            <TabsTrigger value="proses" onClick={() => { setActiveTab("proses"); setPage(1) }} className='text-xs'>Proses</TabsTrigger>
                            <TabsTrigger value="terkirim" onClick={() => { setActiveTab("terkirim"); setPage(1) }} className='text-xs'>Terkirim</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab}>
                            <CardContent className="space-y-2 pt-2">
                                <FilterWorker
                                    setPage={setPage}
                                    searchInput={searchInput}
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
                                {dataOrderDeliveryLoading && <Loading />}
                                {dataOrderDeliveryError && <div>Silahkan coba beberapa saat lagi.</div>}
                                {!dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 ? (
                                    dataOrderDelivery?.orders?.map((order: any) => (
                                        <section
                                            key={order.id}
                                            className="flex justify-between items-center border-b py-4"
                                        >
                                            {order?.orderStatus[0]?.status !== 'DRIVER_DELIVERED_LAUNDRY' ? (
                                                < ConfirmAlert
                                                    colorConfirmation="blue"
                                                    caption={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                                                            ? 'Apakah Anda ingin melakukan pengiriman untuk pesanan ini?'
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                                                'Apakah Anda ingin menyelesaikan pengiriman untuk pesanan ini?'
                                                                : ''
                                                    }
                                                    description={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                                                            ? 'Pastikan anda memilih order yang tepat/benar'
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                                                'Pastikan anda memilih order yang tepat/benar'
                                                                : ''
                                                    }
                                                    onClick={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                                                            ? () => handleProcessDelivery(order?.id)
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                                                () => handleAcceptOrderDelivery(order?.id)
                                                                : () => { }
                                                    }
                                                    disabled={
                                                        (order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true && handleProcessDeliveryPending)
                                                            || (order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && handleAcceptOrderDeliveryPending)
                                                            ? true
                                                            : false
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        <div className="px-2">
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.id}
                                                            </h2>
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.User?.firstName} {order?.User?.lastName}
                                                            </h2>
                                                            <div className="text-xs text-gray-500">
                                                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                                                    ? 'Menunggu Pembayaran' :
                                                                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                                        ? 'Siap untuk diantar' :
                                                                        order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                                                            ? 'Proses Pengantaran' :
                                                                            order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true
                                                                                ? 'Laundry berhasil diantar'
                                                                                : ''}
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </ConfirmAlert>
                                            ) : (

                                                <div className="flex items-center">
                                                    <div className="px-2">
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.id}
                                                        </h2>
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.User?.firstName} {order?.User?.lastName}
                                                        </h2>
                                                        <div className="text-xs text-gray-500">
                                                            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                                                ? 'Menunggu Pembayaran' :
                                                                order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                                    ? 'Siap untuk dikirim' :
                                                                    order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                                                        ? 'Proses Pengiriman' :
                                                                        order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true
                                                                            ? 'Laundry berhasil diantar'
                                                                            : ''
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-1">
                                                <Link href={`https://wa.me/62${order.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                                    <FaWhatsapp />
                                                </Link>
                                            </div>
                                        </section>
                                    ))
                                ) : (
                                    !dataOrderDeliveryLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </div>
            </ContentMobileLayout>

            <ContentWebLayout caption='Pengiriman'>
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
                        { value: 'waiting-driver', label: 'Belum Dijemput' },
                        { value: 'proses', label: 'Proses' },
                        { value: 'terkirim', label: 'Terkirim' },
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
                                !dataOrderDeliveryLoading && dataOrderDelivery?.orders?.length > 0 ? (
                                    dataOrderDelivery?.orders?.map((order: any, i: number) => (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Setrika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : 'Layanan Laundry'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                                    ? 'Menunggu Pembayaran' :
                                                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                        ? 'Siap untuk dikirim' :
                                                        order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                                            ? 'Proses Pengiriman' :
                                                            order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true
                                                                ? 'Laundry berhasil diantar'
                                                                : 'Menunggu Pembayaran'
                                                }
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]}</td>
                                            <td className="py-4 px-6 hover:underline break-words">
                                                <ConfirmAlert colorConfirmation="blue"
                                                    caption={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                                                            ? 'Apakah Anda ingin melakukan pengiriman untuk pesanan ini?'
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                                                'Apakah Anda ingin menyelesaikan pengiriman untuk pesanan ini?'
                                                                : ''
                                                    }
                                                    description={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                                                            ? 'Pastikan anda memilih order yang tepat/benar'
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                                                'Pastikan anda memilih order yang tepat/benar'
                                                                : ''
                                                    }
                                                    onClick={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true && order.isReqDelivery === true
                                                            ? () => handleProcessDelivery(order?.id)
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' ?
                                                                () => handleAcceptOrderDelivery(order?.id)
                                                                : () => console.log('')
                                                    }>
                                                    <button disabled={order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true} className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500'>
                                                        {order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true ? 'Selesai' : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true ? 'Proses' : 'Selesaikan'}</button>
                                                </ConfirmAlert>
                                            </td>
                                        </tr>
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
                    <PaginationWebLayout currentPage={page} totalPages={totalPages || '1'}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Sebelumnya</ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => { setPage((prev) => Math.min(prev + 1, totalPages)) }}>Selanjutnya</ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}