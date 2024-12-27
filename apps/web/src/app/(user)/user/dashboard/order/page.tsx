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
import FilterWorker from "@/components/core/filter"
import Pagination from "@/components/core/pagination"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import Timeline from "@/components/core/timeline"
import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/button";
import SearchInputCustom from "@/components/core/searchBar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaPlus } from "react-icons/fa6";
import HorizontalTimeline from "@/components/core/timelineUser"


export default function DeliveryRequest() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)

    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "waiting-payment");
    const [dateFrom, setDateFrom] = useState(params.get('dateFrom') || null);
    const [dateUntil, setDateUntil] = useState(params.get('dateUntil') || null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [outletId, setOutletId] = useState<any>(null);

    const limit = 5;

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
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    console.log(orderData)

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
            console.log(res)
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
            currentUrl.set(`dateFrom`, dateFrom?.toString())
        } else {
            currentUrl.delete(`dateFrom`)
        }
        if (dateUntil) {
            currentUrl.set(`dateUntil`, dateUntil?.toString())
        } else {
            currentUrl.delete(`dateUntil`)
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderList?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex justify-between gap-2 items-center font-bold w-screen pr-16">
                                <div className="flex justify-center items-center gap-2"><Link href='/admin/settings'><FaArrowLeft /></Link> ORDER</div>
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="waiting-payment" onClick={() => { setActiveTab("waiting-payment"); setPage(1) }} >Belum Bayar</TabsTrigger>
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
                                        />
                                        {dataOrderListLoading && <div>Loading...</div>}
                                        {dataOrderListError && <div>Silahkan coba beberapa saat lagi.</div>}
                                        {dataOrderList?.orders?.map((order: any) => (
                                            <section
                                                key={order.id}
                                                className="flex justify-between items-center border-b py-4"
                                            >

                                                <div
                                                    onClick={() => {

                                                        setOrderData(null);
                                                        handleOrderDetail(order?.id);
                                                        setOpenDialog(true)
                                                    }}

                                                    className="flex items-center">
                                                    <div className="ml-2">
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.id}
                                                        </h2>
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.User?.firstName} {order?.User?.lastName}
                                                        </h2>
                                                        <div className="text-xs text-gray-500">
                                                            {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                                ? 'Menunggu Driver'
                                                                : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' || order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET'
                                                                    ? 'Proses Pickup'
                                                                    : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' || order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' || order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS'
                                                                        ? 'Proses Laundry'
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
                                                </div>

                                                <div className="flex gap-1">

                                                </div>
                                            </section>
                                        ))}
                                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                            <Dialog open={openDialog} onOpenChange={(isOpen) => setOpenDialog(isOpen)}>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Detail Order</DialogTitle>
                                    </DialogHeader>

                                    {/* Order Detail Content */}
                                    {orderData ? (
                                        <>
                                            <div className="grid gap-4 py-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-col">
                                                        <h2 className="text-base font-semibold">{orderData?.order?.id}</h2>
                                                        <h2 className="text-base">{orderData?.order?.OrderType?.type}</h2>

                                                        {orderData?.order?.isPaid ?
                                                            <div className="border w-fit px-1 rounded-md bg-green-200 border-green-600 text-green-600">
                                                                Pembayaran Berhasil
                                                            </div>
                                                            :
                                                            <div className="border w-fit px-1 rounded-md bg-red-200 border-red-600 text-red-600">
                                                                Menunggu Pembayaran
                                                            </div>
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
                                                    Proses :
                                                    <HorizontalTimeline orderStatus={orderData?.orderStatus} />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="border rounded-lg border-gray-700 p-2 shadow-md">
                                                        <div className="font-semibold">Driver Pickup:</div>
                                                        <div>
                                                            {orderData?.orderStatus[1]?.status === "DRIVER_TO_OUTLET" ? (
                                                                <>
                                                                    <div>
                                                                        {`${orderData?.orderStatus[1]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[1]?.Worker?.lastName ?? ''}`}
                                                                    </div>
                                                                    <div>
                                                                        {orderData?.orderStatus[1]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                "Menunggu Driver"
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="border rounded-lg border-gray-700 p-2 shadow-md">
                                                        <div className="font-semibold">Delivery Driver:</div>
                                                        <div>
                                                            {orderData?.orderStatus[1]?.status === "DRIVER_TO_CUSTOMERT" ? (
                                                                <>
                                                                    <div>
                                                                        {`${orderData?.orderStatus[1]?.Worker?.firstName ?? ''} ${orderData?.orderStatus[1]?.Worker?.lastName ?? ''}`}
                                                                    </div>
                                                                    <div>
                                                                        {orderData?.orderStatus[1]?.Worker?.phoneNumber ?? 'No phone number available'}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                "Belum Ada Driver"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Map Order Items */}
                                            {/* <div className="text-center">
                                                <h3 className="font-medium">Order Items</h3>
                                                <div className="grid grid-cols-2  justify-items-center">
                                                    {orderData.orderDetail?.map((item: any, index: number) => (
                                                        <div key={index} className="border-b border-black py-1 flex items-center justify-center">
                                                            <span>{item?.quantity}x {item?.LaundryItem?.itemName}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div> */}
                                            {/* Delivery Fee and Total Price */}
                                            <div className="flex justify-between">
                                                <span className="font-medium">Biaya Kirim:</span>
                                                <span>Rp{orderData?.order?.deliveryFee?.toLocaleString("id-ID")}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Harga Laundry:</span>
                                                <span>Rp{orderData?.order?.laundryPrice?.toLocaleString("id-ID")}</span>
                                            </div>
                                            <div className="flex justify-between font-semibold">
                                                <span>Total Harga:</span>
                                                <span>Rp{(orderData?.order?.deliveryFee + orderData?.order?.laundryPrice)?.toLocaleString("id-ID")}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <div>Loading order details...</div>
                                    )}
                                    {orderData?.order?.isPaid === true && orderData?.order?.isConfirm === false ?
                                        <div className="flex justify-center">
                                            <ButtonCustom btnColor="bg-blue-500" txtColor="text-white">Konfirmasi Laundry</ButtonCustom>
                                        </div>
                                        : orderData?.order?.isPaid === false && orderData?.order?.isConfirm === false ?
                                            <div className="flex justify-center">
                                                <ButtonCustom btnColor="bg-blue-500" txtColor="text-white">Bayar Sekarang</ButtonCustom>
                                            </div>
                                            : orderData?.order?.isPaid === false && orderData?.order?.isConfirm === false && orderData?.order?.paymentProof ?
                                                <div className="flex justify-center">
                                                    <ButtonCustom btnColor="bg-blue-500" txtColor="text-white">Menunggu Verivikasi Admin</ButtonCustom>
                                                </div>
                                                : ''
                                    }
                                </DialogContent>
                            </Dialog>
                        </div>
                    </main>
                </section>
            </main>

            {/* web sesi */}
            <ContentWebLayout caption="Order">
                <div className="w-full h-fit flex items-center">
                    <div className="w-1/2 h-fit flex items-center">
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-[150px] border rounded-full py-2 px-3">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date-asc">Tanggal Terlama</SelectItem>
                                <SelectItem value="date-desc">Tanggal Terbaru</SelectItem>
                                <SelectItem value="name-asc">Nama Cust. A-Z</SelectItem>
                                <SelectItem value="name-desc">Nama Cust. Z-A</SelectItem>
                                <SelectItem value="order-id-asc">Order Id A-Z</SelectItem>
                                <SelectItem value="order-id-desc">Order Id Z-A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                        <Link href='/admin/worker/c'>
                            <ButtonCustom rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500"><FaPlus /> Buat Data Pekerja</ButtonCustom>
                        </Link>
                    </div>
                </div>

                {/* table */}
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
                            {getDataItem?.length > 0 ? (
                                getDataItem?.map((order: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu kurir' : ''}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.Store?.storeName}</td>
                                            <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <Link href={`/admin/worker/detail/${order?.id}`}>View</Link>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold">{isFetching ? 'Mohon tunggu...' : 'Data tidak tersedia'}</td>
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