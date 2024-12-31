'use client'

import * as Yup from "yup";
import Loading from "@/components/core/loading"
import NoData from "@/components/core/noData"
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
import { FaArrowUpRightFromSquare, FaCheck, FaPlus } from "react-icons/fa6";
import { ConfirmAlert } from "@/components/core/confirmAlert"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"

export default function DeliveryRequest() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const notesSchema = Yup.object({
        notes: Yup.string().required("Notes are required"),
    });


    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "ready-to-deliver");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isSearchValues, setIsSearchValues] = useState<string>('')

    const limit = 5;

    const { data: dataOrderDelivery, refetch, isLoading: dataOrderDeliveryLoading, isError: dataOrderDeliveryError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get(`/order/order-delivery/`, {
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

    const { mutate: handleRequestDelivery, isPending } = useMutation({
        mutationFn: async (orderId: any) => {
            return await instance.patch(`/order/order-delivery/${orderId}`, { email }, {

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
            currentUrl.set(`date-from`, dateFrom?.toString())
        } else {
            currentUrl.delete(`date-from`)
        }
        if (dateUntil) {
            currentUrl.set(`date-until`, dateUntil?.toString())
        } else {
            currentUrl.delete(`date-until`)
        }
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderDelivery?.totalPage || 1;

    return (
        <>
            <MobileSessionLayout title="REQUEST DELIVERY">
                <div className="mx-4 space-y-4">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="hidden w-full">
                            <TabsTrigger value="ready-to-deliver" onClick={() => { setActiveTab("ready-to-deliver"); setPage(1) }} >Siap Kirim</TabsTrigger>
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
                                    setPage={setPage}
                                    searchInput={searchInput}
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
                                            {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true ? (
                                                < ConfirmAlert
                                                    colorConfirmation="blue"
                                                    caption={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                            ? 'Apakah Anda ingin request pengiriman untuk pesanan ini?'
                                                            : ''
                                                    }
                                                    description={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                            ? 'Pastikan anda memilih order yang tepat/benar'
                                                            : ''
                                                    }
                                                    onClick={() => {
                                                        handleRequestDelivery(order?.id);
                                                    }}
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
                                                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                                                    ? 'Menunggu Pembayaran' :
                                                                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                                        ? 'Siap untuk dikirim'
                                                                        : 'tes'}
                                                            </div>
                                                            <p className="text-xs text-gray-500">
                                                                {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </ConfirmAlert>
                                            ) : (

                                                <div className="flex items-center">
                                                    <div className="ml-2">
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
                                                                    ? 'Siap untuk dikirim'
                                                                    : 'tes'}
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
            </MobileSessionLayout>

            <ContentWebLayout caption='Pengiriman'>
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

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Order ID</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tipe</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrderDelivery?.orders?.length > 0 ? (
                                dataOrderDelivery?.orders?.map((order: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                                    ? 'Menunggu Pembayaran' :
                                                    order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                        ? 'Siap untuk dikirim'
                                                        : 'tes'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : 'Mencuci dan Strika'}</td>
                                            <td className="py-4 px-6 text-sm text-blue-600 break-words">
                                                <ConfirmAlert colorConfirmation="blue"
                                                    caption={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                            ? 'Apakah Anda ingin request pengiriman untuk pesanan ini?'
                                                            : ''
                                                    }
                                                    description={
                                                        order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === true
                                                            ? 'Pastikan anda memilih order yang tepat/benar'
                                                            : ''
                                                    } onClick={() => handleRequestDelivery(order?.id)}>
                                                    <button className="text-blue-600 hover:text-blue-400 relative group">
                                                        Selesaikan
                                                    </button>
                                                </ConfirmAlert>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold">Data tidak tersedia</td>
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
                            // disabled={page == 1} onClick={() => handlePageChange(page - 1)}
                            >Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                            // disabled={page == totalPages || page > totalPages} onClick={() => handlePageChange(page + 1)}
                            >Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout>
        </>
    )
}