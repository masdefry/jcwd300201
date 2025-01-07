'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import { instance } from "@/utils/axiosInstance"
import authStore from "@/zustand/authstore"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useToast } from "@/components/hooks/use-toast"
import FilterWorker from "@/components/core/filter"
import Pagination from "@/components/core/pagination"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Timeline from "@/components/core/timeline"
import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/button";
import SearchInputCustom from "@/components/core/searchBar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaPlus, FaWhatsapp } from "react-icons/fa6";
import Loading from "@/components/core/loading"
import NoData from "@/components/core/noData"
import FilterWeb from "@/components/core/filterWeb"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"
import Link from "next/link"


export default function DeliveryRequest() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [isSearchValues, setIsSearchValues] = useState<string>('')
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "proses");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [outletId, setOutletId] = useState<any>(null);

    const limit = 5;

    const { data: dataOrderList, refetch, isLoading: dataOrderListLoading, isError: dataOrderListError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get(`/order/orders/`, {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: activeTab,
                    dateFrom,
                    dateUntil,
                    outletId
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);

    const { mutate: handleOrderDetail } = useMutation({
        mutationFn: async (id: any) => {
            const res = await instance.get(`/order/orders-detail/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return setOrderData(res?.data?.data);
        },
    })

    const { data: getDataStore, isFetching, isLoading: isStoreLoading, isError: isStoreError } = useQuery({
        queryKey: ['get-data-store'],
        queryFn: async () => {
            const res = await instance.get('/store')
            return res?.data?.data
        }
    })

    const getDataItem = dataOrderList?.dataOrder

    const handlePageChange = (page: any) => {
        setPage(page)
    }


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
            currentUrl.set(`date-from`, dateFrom?.toString())
        } else {
            currentUrl.delete(`date-from`)
        }
        if (dateUntil) {
            currentUrl.set(`date-until`, dateUntil?.toString())
        } else {
            currentUrl.delete(`date-until`)
        }
        if (page) {
            currentUrl.set(`page`, page?.toString())
        } else {
            currentUrl.delete(`page`)
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderList?.totalPage || 1;

    return (
        <>
            <MobileSessionLayout title="Pesanan">
                <Tabs defaultValue={activeTab} className="fit pb-28">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="proses" onClick={() => { setActiveTab("proses"); setPage(1) }} >Proses</TabsTrigger>
                        <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }} >Selesai</TabsTrigger>
                    </TabsList>
                    <TabsContent value={activeTab}>
                        <CardContent className="space-y-2 pt-2">
                            <FilterWorker debounce={debounce} sortOption={sortOption} setSortOption={setSortOption}
                                dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom} setDateUntil={setDateUntil}
                                setActiveTab={setActiveTab} setSearchInput={setSearchInput} searchInput={searchInput}
                                setPage={setPage} setIsSearchValues={setIsSearchValues} isSearchValues={isSearchValues} />

                            {dataOrderListLoading && <Loading />}
                            {dataOrderListError && <div>Silahkan coba beberapa saat lagi.</div>}
                            {!dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                dataOrderList?.orders?.map((order: any) => (
                                    <section key={order.id} className="flex justify-between items-center border-b py-4">
                                        <span onClick={() => {
                                            setOrderData(null);
                                            handleOrderDetail(order?.id);
                                            setOpenDialog(true)
                                        }} className="flex items-center">
                                            <div className="px-2">
                                                <h2 className="font-medium text-gray-900">{order?.id.length > 15 ? <span>{order?.id.slice(0, 15)}..</span> : order?.id}</h2>
                                                <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                                                <div className="text-xs text-gray-500">
                                                    {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                        ? 'Menunggu Driver'
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                                                            ? 'Driver Menuju Store'
                                                            : order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                                                ? 'Diterima Outlet'
                                                                : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                    ? 'Proses Cuci'
                                                                    : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                                                        ? 'Proses Setrika'
                                                                        : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                                            ? 'Proses Packing'
                                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER'
                                                                                ? 'Proses Delivery'
                                                                                : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                                                                                    ? 'Laundry Sampai'
                                                                                    : 'Status tidak dikenal'}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                </p>
                                            </div>
                                        </span>
                                    </section>
                                ))
                            ) : (
                                !dataOrderListLoading && (<NoData />)
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
                            <>
                                <div className="grid gap-4 py-2 border-b border-neutral-400">
                                    <div className="flex justify-between gap-3 items-center">
                                        <div className="w-2/3 flex flex-col">
                                            <h2 className="text-sm font-semibold">{orderData?.order?.id?.length > 15 ? <span>{orderData?.order?.id.slice(0, 15)}..</span> : orderData?.order?.id}</h2>
                                            <h2 className="text-sm">{orderData?.order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' :
                                                orderData?.order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : 'Mencuci dan Setrika'}</h2>
                                        </div>
                                        <div className="w-1/3 flex flex-col items-end">
                                            <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[0]} </p>
                                            <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[1].slice(0, 5)} </p>
                                        </div>
                                    </div>
                                </div>

                                <span className='font-semibold'>Proses Laundry:</span>
                                <div className="flex flex-row justify-between pb-2">
                                    <div className='space-y-2'>
                                        <Timeline orderStatus={orderData?.orderStatus} />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="border rounded-lg border-gray-700 p-2 text-sm">
                                            <div className="font-semibold">Driver Pickup:</div>
                                            <div>
                                                {orderData?.orderStatus[1]?.status === "DRIVER_TO_OUTLET" ? (
                                                    <>
                                                        <Link href={`https://wa.me/62${orderData?.orderStatus[1]?.Worker?.phoneNumber.substring(1)}`} className="text-black">
                                                            <div>
                                                                {`${orderData?.orderStatus[1]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[1]?.Worker?.lastName ?? ''}`}
                                                            </div>
                                                            <div className="flex gap-1 items-center">
                                                                <FaWhatsapp color="green" />{orderData?.orderStatus[1]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                            </div>
                                                        </Link>
                                                    </>
                                                ) : (
                                                    "Menunggu Driver"
                                                )}
                                            </div>
                                        </div>
                                        <div className="border rounded-lg border-gray-700 p-2 text-sm">
                                            <div className="font-semibold">Delivery Driver:</div>
                                            <div>
                                                {orderData?.orderStatus[7]?.status === "DRIVER_TO_CUSTOMER" ? (
                                                    <>
                                                        <Link href={`https://wa.me/62${orderData?.orderStatus[7]?.Worker?.phoneNumber.substring(1)}`} className="text-black">
                                                            <div>
                                                                {`${orderData?.orderStatus[7]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[7]?.Worker?.lastName ?? ''}`}
                                                            </div>
                                                            <div className="flex gap-1 items-center">
                                                                <FaWhatsapp color="green" />{orderData?.orderStatus[7]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                            </div>
                                                        </Link>
                                                    </>

                                                ) : orderData?.orderStatus[8]?.status === "DRIVER_TO_CUSTOMER" ? (
                                                    <>
                                                        <Link href={`https://wa.me/62${orderData?.orderStatus[8]?.Worker?.phoneNumber.substring(1)}`} className="text-black">
                                                            <div>
                                                                {`${orderData?.orderStatus[8]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[8]?.Worker?.lastName ?? ''}`}
                                                            </div>
                                                            <div className="flex gap-1 items-center">
                                                                <FaWhatsapp color="green" />{orderData?.orderStatus[8]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                            </div>
                                                        </Link>

                                                    </>
                                                ) : (
                                                    "Belum Ada Driver"
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full h-fit py-2 border-t space-y-1 border-neutral-400">
                                    <div className="flex justify-between text-sm">
                                        <h1 className="font-medium">Biaya Kirim:</h1>
                                        <p>Rp{orderData?.order?.deliveryFee?.toLocaleString("id-ID")}</p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <h1 className="font-medium">Harga Laundry:</h1>
                                        <p>Rp{orderData?.order?.laundryPrice?.toLocaleString("id-ID")}</p>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <h1 className="font-medium">Total Harga:</h1>
                                        <p>Rp{(orderData?.order?.deliveryFee + orderData?.order?.laundryPrice)?.toLocaleString("id-ID")}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Loading />
                        )}
                    </DialogContent>
                </Dialog>
            </MobileSessionLayout>

            <ContentWebLayout caption="Riwayat Pesanan">
                <FilterWeb isSearchValues={isSearchValues} setIsSearchValues={setIsSearchValues} debounce={debounce} sortOption={sortOption}
                    setSortOption={setSortOption} dateFrom={dateFrom} dateUntil={dateUntil} setDateFrom={setDateFrom}
                    setDateUntil={setDateUntil} setActiveTab={setActiveTab} setSearchInput={setSearchInput} activeTab={activeTab}
                    outletId={outletId} setOutletId={setOutletId} getDataStore={getDataStore} isStoreLoading={isStoreLoading}
                    isStoreError={isStoreError} setPage={setPage} showStoreSelect={false} searchInput={searchInput}
                    options={[
                        { value: 'proses', label: 'Dalam Proses' },
                        { value: 'done', label: 'Selesai' },
                    ]} borderReset="border rounded-full" />
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Order ID</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Customer</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Store</th>
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
                                !dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                    dataOrderList?.orders?.map((order: any, i: number) => (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                    ? 'Menunggu Driver'
                                                    : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                                                        ? 'Driver Menuju Store'
                                                        : order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                                            ? 'Diterima Outlet'
                                                            : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                ? 'Proses Cuci'
                                                                : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                                                    ? 'Proses Setrika'
                                                                    : order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                                        ? 'Proses Packing'
                                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER'
                                                                            ? 'Proses Delivery'
                                                                            : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY'
                                                                                ? 'Laundry Sampai'
                                                                                : 'Status tidak dikenal'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.Store?.storeName}</td>
                                            <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div onClick={() => {
                                                    setOrderData(null);
                                                    handleOrderDetail(order?.id);
                                                    setOpenDialog(true)
                                                }}>View</div>
                                            </td>
                                        </tr>
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
                                disabled={page == 1} onClick={() => handlePageChange(page - 1)}>Sebelumnya</ButtonCustom>
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