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
import ContentWebSession from "@/components/core/webSessionContent"


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
    const [sortOption, setSortOption] = useState("date-asc");
    const [activeTab, setActiveTab] = useState("all");

    const { data: dataOrderAwaitingPickup, refetch, isLoading: dataOrderAwaitingPickupLoading, isError: dataOrderAwaitingPickupError } = useQuery({
        queryKey: ['get-order', page, searchInput],
        queryFn: async () => {
            const tabValue =
                activeTab === "waiting-pickup" ? "AWAITING_DRIVER_PICKUP" :
                    activeTab === "process-pickup" ? "DRIVER_TO_OUTLET" :
                        activeTab === "arrived" ? "DRIVER_ARRIVED_AT_OUTLET" : "";

            const res = await instance.get('/worker/order', {
                params: {
                    page,
                    limit_data: entriesPerPage,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: tabValue,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessOrder, isPending } = useMutation({
        mutationFn: async (id: any) => {
            return await instance.post(`/worker/accept-order/${id}`, { email }, {

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

        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, activeTab, totalPages, refetch]);



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
                                        <div className="flex justify-between gap-1 items-center">
                                            <div className="flex justify-between gap-1 items-center">
                                                <div className="flex items-center justify-center">
                                                    <div className="relative w-full max-w-md">
                                                        <input
                                                            type="text"
                                                            onChange={(e) => debounce(e.target.value)}
                                                            placeholder="Search..."
                                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                                    </div>
                                                </div>
                                            </div>
                                            <Select value={sortOption} onValueChange={setSortOption}>
                                                <SelectTrigger className="w-[150px] border rounded-md py-2 px-3">
                                                    <SelectValue placeholder="Sort By" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="date-asc">Tanggal Asc.</SelectItem>
                                                    <SelectItem value="date-desc">Tanggal Desc.</SelectItem>
                                                    <SelectItem value="name-asc">Customer Name Asc.</SelectItem>
                                                    <SelectItem value="name-desc">Customer Name Desc.</SelectItem>
                                                    <SelectItem value="order-id-asc">Order Id Desc.</SelectItem>
                                                    <SelectItem value="order-id-desc">Order Id Desc.</SelectItem>

                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {dataOrderAwaitingPickupLoading && <p>Loading...</p>}
                                        {dataOrderAwaitingPickupError && <p>Silahkan coba beberapa saat lagi.</p>}
                                        {dataOrderAwaitingPickup?.orders?.map((order: any) => (
                                            <section
                                                key={order.id}
                                                className="flex justify-between items-center border-b py-4"
                                            >

                                                <ConfirmAlert
                                                    colorConfirmation="green"
                                                    caption={
                                                        order.latestStatus === 'AWAITING_DRIVER_PICKUP'
                                                            ? 'melakukan pengambilan laundry pada order ini'
                                                            : order.latestStatus === 'DRIVER_TO_OUTLET'
                                                                ? 'menyelesaikan pengiriman laundry pada order ini'
                                                                : ''
                                                    }
                                                    onClick={() => handleProcessOrder(order?.id)}>
                                                    <div className="flex items-center">
                                                        <div className="ml-2">
                                                            <h2 className="font-medium text-gray-900">

                                                                {order?.Users?.firstName} {order?.Users?.lastName}
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

                                        <div className="flex justify-between items-center mt-4">
                                            <button
                                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100"
                                            >
                                                Previous
                                            </button>
                                            <span>
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={page === totalPages}
                                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </section>
            </main>

            {/* web ssi */}
            <ContentWebSession caption='Permintaan Pesanan'>
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
                                dataOrderAwaitingPickup?.orders?.map((item: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={item?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{item?.userFirstName} {item?.userLastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{item?.OrderType?.Type}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {item?.latestStatus === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Pickup' :
                                                    item?.latestStatus === 'DRIVER_TO_OUTLET' ? 'Perjalanan Menuju Outlet' :
                                                        item?.latestStatus === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Sampai Pada Outlet' :
                                                            item?.latestStatus}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{item?.createdAt.split('T')[0]} {item?.createdAt.split('T')[1].split('.')[0]}</td>
                                            <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <Link href={`/admin/worker/detail/${item?.id}`}>View</Link>
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
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => { setPage((prev) => Math.min(prev + 1, totalPages)) }}>Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebSession>
        </>
    )
}