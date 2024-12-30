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
import { FaPlus } from "react-icons/fa6"
import ContentWebLayout from "@/components/core/webSessionContent"
import Pagination from "@/components/core/pagination"
import FilterWorker from "@/components/core/filter"
import PaginationWebLayout from "@/components/core/paginationWebLayout"

export default function DriverDelivery() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);


    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "all");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const limit = 5;

    const { data: dataOrderDelivery, refetch, isLoading: dataOrderDeliveryLoading, isError: dataOrderDeliveryError } = useQuery({
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
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderDelivery?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> REQUEST DELIVERY
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} >Semua</TabsTrigger>
                                    <TabsTrigger value="menungguDriver" onClick={() => { setActiveTab("menungguDriver"); setPage(1) }} >Belum Dikirim</TabsTrigger>
                                    <TabsTrigger value="proses" onClick={() => { setActiveTab("proses"); setPage(1) }} >Proses</TabsTrigger>
                                    <TabsTrigger value="terkirim" onClick={() => { setActiveTab("terkirim"); setPage(1) }} >Terkirim</TabsTrigger>
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
                                        />
                                        {dataOrderDeliveryLoading && <div>Loading...</div>}
                                        {dataOrderDeliveryError && <div>Silahkan coba beberapa saat lagi.</div>}
                                        {dataOrderDelivery?.orders?.map((order: any) => (
                                            <section key={order.id} className="flex justify-between items-center border-b py-4">
                                                {order?.orderStatus[0]?.status !== 'DRIVER_DELIVERED_LAUNDRY' ? (
                                                    <ConfirmAlert
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
                                                                        order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                                                            ? 'Siap untuk dikirim' :
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
                                                                    order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                                                        ? 'Siap untuk dikirim' :
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
                                        ))}
                                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </section >
            </main>

            <ContentWebLayout caption='Pengiriman'>
                <div className="w-full h-fit flex">
                    <div className="w-1/2 gap-2 h-fit flex items-center">
                        <select name="searchWorker" value={activeTab} onChange={(e) => {
                            setActiveTab(e.target.value)
                            setPage(1)
                        }} id="searchWorker" className="px-4 py-2 border rounded-2xl focus:outline-none focus:border-orange-500
                        border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="all">Semua Pesanan</option>
                            <option value="waiting-pickup">Belum pickup</option>
                            <option value="process-pickup">Dalam perjalanan</option>
                            <option value="arrived">Selesai</option>
                            <option value="all">Reset</option>
                        </select>
                        <select name="sort" value={sortOption} onChange={(e) => {
                            setSortOption(e.target.value)
                            setPage(1)
                        }} id="sort" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm 
                        focus:outline-none focus:border-orange-500 text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="date-asc">Tanggal Terlama</option>
                            <option value="date-desc">Tanggal Terbaru</option>
                            <option value="name-asc">Urutkan nama A - Z</option>
                            <option value="name-desc">Urutkan nama Z - A</option>
                        </select>
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
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tipe Order</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Tanggal dibuat</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrderDelivery?.orders?.length > 0 ? (
                                dataOrderDelivery?.orders?.map((order: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Strika' : 'Layanan Laundry'}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'IN_PACKING_PROCESS' && order?.isPaid === false
                                                    ? 'Menunggu Pembayaran' :
                                                    order?.orderStatus[0]?.status === 'DRIVER_TO_CUSTOMER' && order?.isPaid === true
                                                        ? 'Siap untuk dikirim' :
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
                                                        {order?.orderStatus[0]?.status === 'DRIVER_DELIVERED_LAUNDRY' && order?.isPaid === true ? 'Selesai' : 'Selesaikan'}</button>
                                                </ConfirmAlert>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold text-3xl text-neutral-300">Data Tersedia</td>
                                </tr>
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