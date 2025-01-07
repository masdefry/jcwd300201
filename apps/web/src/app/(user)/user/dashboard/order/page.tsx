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
import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/button";
import HorizontalTimeline from "@/components/core/timelineUser"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import NoData from "@/components/core/noData"
import Loading from "@/components/core/loading"
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout"
import { GrNotes } from "react-icons/gr"
import FilterWeb from "@/components/core/filterWeb"
import Link from "next/link"
import { FaWhatsapp } from "react-icons/fa6"

export default function Page() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "waiting-payment");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [isSearchValues, setIsSearchValues] = useState<string>('')
    const [openDialog, setOpenDialog] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [limit, setLimit] = useState<number>(5)

    const { data: dataOrderList, refetch, isLoading: dataOrderListLoading, isError: dataOrderListError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get(`/order/history-user/`, {
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
            return res?.data?.data;
        },
    })

    const { mutate: handleOrderConfirmation, isPending } = useMutation({
        mutationFn: async (id: any) => {
            return await instance.post(`/order/confirm/${id}`, { email }, {

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

    const handlePageChange = (page: any) => {
        setPage(parseInt(page))
    }

    const debounce = useDebouncedCallback(values => {
        setSearchInput(values)
        setPage(1)
    }, 500)

    const totalPages = dataOrderList?.totalPage || 1
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

    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil])

    return (
        <>
            <ContentMobileLayout title='Pesanan Saya' icon={<GrNotes className='text-lg' />}>
                <Tabs defaultValue={activeTab} className="pb-28">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="waiting-payment" onClick={() => { setActiveTab("waiting-payment"); setPage(1) }} className='text-xs'>Belum Bayar</TabsTrigger>
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
                                dataOrderList?.orders?.map((order: any) => (
                                    <section key={order.id} className="flex justify-between items-center border-b py-4">
                                        <div onClick={() => {
                                            setOrderData(null);
                                            handleOrderDetail(order?.id);
                                            setOpenDialog(true)
                                        }} className="flex items-center">
                                            <div className="px-2">
                                                <h2 className="font-medium text-gray-900">{order?.id.length > 15 ? <span>{order?.id?.slice(0, 15)}..</span> : order?.id}</h2>
                                                <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                                                <div className="text-xs text-gray-500">
                                                    {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                        ? 'Menunggu Driver'
                                                        : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' || order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                                            ? 'Proses Pickup'
                                                            : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' || order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' || order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                                ? 'Proses Laundry'
                                                                : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER'
                                                                    ? 'Proses Delivery'
                                                                    : 'Status tidak dikenal'}</div>
                                                <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                            </div>
                                        </div>
                                        {order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isConfirm === false ?
                                            <div className="border text-center w-fit text-sm px-1 rounded-md bg-yellow-200 border-yellow-600 text-yellow-600">
                                                Konfirmasi Order
                                            </div>
                                            : order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isConfirm === true ?
                                                <div className="border w-fit text-sm px-1 rounded-md bg-green-200 border-green-600 text-green-600">
                                                    Terkonfirmasi
                                                </div>
                                                : ''}
                                    </section>
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
                            <>
                                <div className="grid gap-4 py-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <h2 className="text-base font-semibold">{orderData?.order?.id}</h2>
                                            <h2 className="text-base">{orderData?.order?.OrderType?.type}</h2>

                                            {orderData?.order?.isPaid ?
                                                <div className="border w-fit px-1 mt-1 rounded-md bg-green-200 border-green-600 text-green-600">
                                                    Pembayaran Berhasil
                                                </div>
                                                : !orderData?.order?.isPaid && orderData?.order?.laundryPrice ?
                                                    <div className="border w-fit px-1 rounded-md bg-red-200 border-red-600 text-red-600">
                                                        Menunggu Pembayaran
                                                    </div>
                                                    : ""
                                            }
                                        </div>
                                        <div className="flex flex-col w-2/6">
                                            <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[0]} </p>
                                            <p className="text-sm text-gray-500">{orderData?.order?.createdAt.split('T')[1].slice(0, 5)} </p>
                                        </div>
                                    </div>
                                </div>




                                <div className="flex flex-col justify-between">
                                    <div>
                                        Proses: <HorizontalTimeline orderStatus={orderData?.orderStatus} />
                                    </div>
                                    <div className="space-y-3 my-3">
                                        <div className="border rounded-lg border-gray-700 p-2 shadow-md">
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
                                        <div className="border rounded-lg border-gray-700 p-2 shadow-md">
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
                                <div className="flex justify-between">
                                    <span className="font-medium">Biaya Kirim:</span>
                                    <span>Rp{orderData?.order?.deliveryFee?.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Harga Laundry:</span>
                                    <span>{orderData?.order?.laundryPrice
                                        ? `Rp${orderData.order.laundryPrice.toLocaleString("id-ID")}`
                                        : "Menunggu Pembuatan Invoice"}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Total Harga:</span>
                                    <span>Rp{(orderData?.order?.deliveryFee + orderData?.order?.laundryPrice)?.toLocaleString("id-ID")}</span>
                                </div>
                            </>
                        ) : (
                            <div><Loading /></div>
                        )}
                        {orderData?.order?.isPaid === true && orderData?.order?.isConfirm === false && orderData?.order?.isDone === true && orderData?.order?.isReqDelivery === true ?
                            <ConfirmAlert
                                disabled={isPending}
                                caption="Apakah anda yakin ingin mengkonfirmasi order laundry berikut?"
                                description="Pastikan laundry telah sampai di lokasi anda"
                                onClick={() => { handleOrderConfirmation(orderData?.order?.id) }}>

                                <div className="flex justify-center">
                                    <ButtonCustom disabled={isPending} btnColor="bg-blue-500" txtColor="text-white">Konfirmasi Laundry</ButtonCustom>
                                </div>
                            </ConfirmAlert>
                            : orderData?.order?.isPaid === false && orderData?.order?.isConfirm === false && orderData?.order?.laundryPrice > 1 ?
                                <div className="flex justify-center">
                                    <ButtonCustom width="w-full" btnColor="bg-blue-500" txtColor="text-white" onClick={() => router.push(`/user/dashboard/payment/${orderData?.order?.id}`)}
                                        disabled={orderData?.order?.laundryPrice === null || orderData?.order?.laundryPrice === 0}>Bayar Sekarang</ButtonCustom>
                                </div>
                                : orderData?.order?.isPaid === false && orderData?.order?.isConfirm === false && orderData?.order?.paymentProof ?
                                    <div className="flex justify-center">
                                        <ButtonCustom btnColor="bg-blue-500" txtColor="text-white">Menunggu Verivikasi Admin</ButtonCustom>
                                    </div>
                                    : ''}
                    </DialogContent>
                </Dialog>
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
                        { value: 'proses', label: 'Dalam Proses' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Order ID</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Customer</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tipe Layanan</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrderList?.orders?.length > 0 ? (
                                dataOrderList?.orders?.map((order: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                    ? 'Menunggu Driver'
                                                    : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' || order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                                        ? 'Proses Pickup'
                                                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' || order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' || order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                            ? 'Proses Laundry'
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER'
                                                                ? 'Proses Delivery'
                                                                : 'Status tidak dikenal'}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : order?.OrderType?.type === 'Wash Only' ? 'Mencuci dan Strika' : 'Mencuci dan Setrika'}</td>
                                            <td className="py-4 px-6 text-sm hover:underline break-words">
                                                <button className="text-blue-700 disabled:text-neutral-600 hover:text-blue-500" disabled={order?.laundryPrice === null || order?.laundryPrice === 0} onClick={() => {
                                                    setOrderData(null)
                                                    handleOrderDetail(order?.id)
                                                    setOpenDialog(true)
                                                }}>Lihat</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center font-bold">{dataOrderListLoading ? <Loading /> : <NoData />}</td>
                                </tr>
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