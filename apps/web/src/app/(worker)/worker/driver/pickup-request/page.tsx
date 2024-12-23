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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaSearch } from 'react-icons/fa';
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
import PaginationWebLayout from "@/features/superAdmin/components/paginationWebLayout"

export default function Page() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);

    const [page, setPage] = useState<number>(1)
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "all");
    const [dateFrom, setDateFrom] = useState(params.get('dateFrom') || null);
    const [dateUntil, setDateUntil] = useState(params.get('dateUntil') || null);
    const limit = 5;

    const { data: dataOrderAwaitingPickup, refetch, isLoading: dataOrderAwaitingPickupLoading, isError: dataOrderAwaitingPickupError } = useQuery({
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

    const { mutate: handleProcessOrder, isPending: handleProcessOrderLoading } = useMutation({
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
    const { mutate: handleProcessOrderOutlet, isPending: handleProcessOrderOutletLoading } = useMutation({
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
    }, [searchInput, page, sortOption, refetch, dateFrom, dateUntil]);



    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit md:hidden block md:max-w-full max-w-[425px]">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> DRIVER PICKUP
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} >Semua</TabsTrigger>
                                    <TabsTrigger value="waiting-pickup" onClick={() => { setActiveTab("waiting-pickup"); setPage(1) }} >Belum PickUp</TabsTrigger>
                                    <TabsTrigger value="process-pickup" onClick={() => { setActiveTab("process-pickup"); setPage(1) }}>Proses</TabsTrigger>
                                    <TabsTrigger value="arrived" onClick={() => { setActiveTab("arrived"); setPage(1) }}>Selesai</TabsTrigger>
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
                                        {dataOrderAwaitingPickupLoading && <p>Loading...</p>}
                                        {dataOrderAwaitingPickupError && <p>Silahkan coba beberapa saat lagi.</p>}
                                        {dataOrderAwaitingPickup?.orders?.map((order: any) => (
                                            <section
                                                key={order.id}
                                                className="flex justify-between items-center border-b py-4"
                                            >

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
                                                    }
                                                    description={
                                                        order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
                                                            ? 'Konfirmasi bahwa Anda akan mengambil laundry untuk order ini'
                                                            : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET'
                                                                ? 'Konfirmasi bahwa barang untuk order ini telah berhasil diantar ke laundry'
                                                                : ''
                                                    }>
                                                    <div className="flex items-center">
                                                        <div className="ml-2">
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.id}
                                                            </h2>
                                                            <h2 className="font-medium text-gray-900">
                                                                {order?.User?.firstName} {order?.User?.lastName}
                                                            </h2>
                                                            <p className="text-xs text-gray-500">
                                                                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                                                                    order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                                                        order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                                                            order?.orderStatus[0]?.status}

                                                            </p>
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
                                        ))}

                                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </section>
            </main>

            {/* web ssi */}
            <ContentWebLayout caption='Permintaan Pesanan'>
                <div className="w-full h-fit flex">
                    <div className="w-1/2 gap-2 h-fit flex items-center">
                        <select name="searchWorker" value={activeTab} onChange={(e) => {
                            setActiveTab(e.target.value)
                            setPage(1)
                        }} id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
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
                        }} id="sort" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
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
                            {dataOrderAwaitingPickup?.orders?.length > 0 ? (
                                dataOrderAwaitingPickup?.orders?.map((order: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                                                    order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                                        order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                                            order?.orderStatus[0]?.status}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
                                            <td className="py-4 px-6 hover:underline break-words">
                                                <ConfirmAlert disabled={order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? true : false} colorConfirmation="blue" caption={order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP'
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
                                                    }>
                                                    <button className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500' disabled={order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? true : false}>{order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Pickup' : order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Selesaikan' :
                                                        order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Selesai' : 'Selesai'}</button>
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
                    <PaginationWebLayout currentPage={page} totalPages={totalPages || '1'}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Sebelumnya</ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => { setPage((prev) => Math.min(prev + 1, totalPages)) }}>Selanjutnya</ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}