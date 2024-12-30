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
import Image from "next/image"
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
import { ConfirmAlert } from "@/components/core/confirmAlert"
import NoData from "@/components/core/noData"
import Loading from "@/components/core/loading"
import FilterWeb from "@/components/core/filterWeb"
import MobileSessionLayout from "@/components/core/mobileSessionLayout"


export default function DeliveryRequest() {
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
    const [activeTab, setActiveTab] = useState(params.get("tab") || "verification");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [isSearchValues, setIsSearchValues] = useState<string>('')

    const limit = 5;

    const { data: dataOrderList, refetch, isLoading: dataOrderListLoading, isError: dataOrderListError, isFetching } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get(`/order/payment/`, {
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


    const { mutate: handleConfirmPayment, isPending: handlConfirmPaymentPending } = useMutation({
        mutationFn: async (orderId: any) => {
            return await instance.post(`/order/payment-done/${orderId}`, { email }, {
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
    const getDataItem = dataOrderList?.orders
    console.log(getDataItem)
    console.log(dataOrderList)

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


    const totalPages = dataOrderList?.totalPage || 1;

    return (
        <>
            <MobileSessionLayout title="PEMBAYARAN">
                <div className="mx-4 space-y-4">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="verification" onClick={() => { setActiveTab("verification"); setPage(1) }} >Verifikasi</TabsTrigger>
                            <TabsTrigger value="waiting-payment" onClick={() => { setActiveTab("waiting-payment"); setPage(1) }} >Belum Bayar</TabsTrigger>
                            <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }} >Selesai</TabsTrigger>
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
                                {dataOrderListLoading && <Loading />}
                                {dataOrderListError && <div>Silahkan coba beberapa saat lagi.</div>}
                                {!dataOrderListLoading && dataOrderList?.orders?.length > 0 ? (
                                    dataOrderList?.orders?.map((order: any) => (
                                        <section
                                            key={order.id}
                                            className="flex justify-between items-center border-b py-4"
                                        >

                                            <ConfirmAlert
                                                caption="Apakah anda yakin ingin melakukan verifikasi pembayaran pada order berikut?"
                                                description={
                                                    <Image
                                                        src={`http://localhost:5000/api/src/public/images/${order.paymentProof}`}
                                                        alt="payment proof"
                                                        width={500}
                                                        height={200}

                                                    />
                                                }
                                                disabled={handlConfirmPaymentPending}
                                                onClick={() => handleConfirmPayment(order?.id)}

                                            >
                                                <div className="flex items-center">
                                                    <div className="ml-2">
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.id}
                                                        </h2>
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.User?.firstName} {order?.User?.lastName}
                                                        </h2>
                                                        <div className="text-xs text-gray-500">
                                                            {order?.orderStatus[0]?.status === 'AWATING_PAYMENT'
                                                                ? 'Menunggu Pembayaran'
                                                                : 'Terbayarkan'}
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                        </p>
                                                    </div>
                                                </div>
                                            </ConfirmAlert>
                                            <div className="flex gap-1">
                                                <Link href={`https://wa.me/62${order.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                                    <FaWhatsapp />
                                                </Link>
                                            </div>
                                        </section>
                                    ))
                                ) : (
                                    !dataOrderListLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderListLoading && dataOrderList?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}                                    </CardContent>
                        </TabsContent>
                    </Tabs>

                </div>
            </MobileSessionLayout>

            {/* web sesi */}
            <ContentWebLayout caption="Order">
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
                        { value: 'verification', label: 'Verifikasi' },
                        { value: 'waiting-payment', label: 'Belum Bayar' },
                        { value: 'done', label: 'Selesai' },
                    ]}
                    borderReset="border rounded-full"
                />
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

                            {isFetching ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderListLoading && getDataItem?.length > 0 ? (
                                    getDataItem?.map((order: any, i: number) => (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' ? 'Menunggu Verifikasi' : 'Terbayarkan'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.Store?.storeName}</td>
                                            <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <ConfirmAlert
                                                    caption="Apakah anda yakin ingin melakukan verifikasi pembayaran pada order berikut?"
                                                    description={
                                                        <Image
                                                            src={`http://localhost:5000/api/src/public/images/${order.paymentProof}`}
                                                            alt="payment proof"
                                                            width={500}
                                                            height={200}

                                                        />
                                                    }
                                                    disabled={handlConfirmPaymentPending}
                                                    onClick={() => handleConfirmPayment(order?.id)}

                                                >
                                                    <div>View</div>
                                                </ConfirmAlert>
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