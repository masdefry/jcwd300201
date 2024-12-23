'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft, FaJediOrder } from "react-icons/fa"
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
import ContentWebLayout from "@/components/core/webSessionContent"
import ButtonCustom from "@/components/core/button"
import SearchInputCustom from "@/components/core/searchBar"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import { FaPlus } from "react-icons/fa6"
import { BsPencil, BsTrash } from "react-icons/bs"

export default function Page() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get('sort') || '');
    const [activeTab, setActiveTab] = useState("semua");
    const [dateFrom, setDateFrom] = useState(params.get('dateFrom') || null);
    const [dateUntil, setDateUntil] = useState(params.get('dateUntil') || null);
    const limit = 5;

    const { data: dataOrderWashingProcess, refetch, isFetching: isFetchingDataOrder, isLoading: dataOrderWashingProcessLoading, isError: dataOrderWashingProcessError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption],
        queryFn: async () => {

            const res = await instance.get('/order/', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res)
            return res?.data?.data;
        },
    });

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


    const totalPages = dataOrderWashingProcess?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit block md:hidden">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> HISTORY ORDER
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">

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
                                {dataOrderWashingProcessLoading && <p>Loading...</p>}
                                {dataOrderWashingProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                                {dataOrderWashingProcess?.orders?.map((order: any) => {
                                    return (
                                        <section
                                            key={order.id}
                                            className="flex justify-between items-center border-b py-4"
                                        >

                                            <div className="flex items-center">
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">
                                                        {order?.User?.firstName} {order?.User?.lastName}
                                                    </h2>
                                                    <p className="text-xs text-gray-500">
                                                        {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false ? 'Menunggu Persetujuan Admin' :
                                                            order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true ? 'Belum Dicuci' :
                                                                order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' ? 'Proses Cuci' :
                                                                    order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' ? 'Selesai' :
                                                                        order?.orderStatus[0]?.status}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                                </div>
                                            </div>
                                        </section>
                                    )
                                })}

                                <div className="flex justify-between items-center mt-4">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={page === 1} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100">
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
                        </div>
                    </main>
                </section>
            </main>

            <ContentWebLayout caption="Order saya">
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center">
                        <select name="searchWorker"
                            value={sortOption} onChange={(e) => setSortOption(e.target.value)}
                            id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="name-asc">Sort berdasarkan A - Z</option>
                            <option value="name-desc">Sort berdasarkan Z - A</option>
                            <option value="date-asc">Sort berdasarkan terbaru</option>
                            <option value="date-desc">Sort berdasarkan terlama</option>
                            <option value="order-id-asc">Sort berdasarkan Order ID</option>
                            <option value="order-id-desc">Sort berdasarkan Order ID</option>
                            <option value="">Reset</option>
                        </select>
                    </div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom placeholder='Cari alamat..' onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                        <ButtonCustom onClick={() => router.push('/user/dashboard/pickup')} rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500"><FaPlus /> Tambah alamat</ButtonCustom>
                    </div>
                </div>
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Order ID</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Layanan</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status Order</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrderWashingProcess?.orders?.length > 0 ? (
                                dataOrderWashingProcess?.orders?.map((order: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{i + 1}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words"> {order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words"> {order?.OrderType?.type === 'Iron Only' ? 'Strika' : order?.OrderType?.type === 'Wash Only' ? 'Mencuci' :
                                                order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci & Setrika' : ''}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words"> {order?.orderStatus[0]?.status === 'AWAITING_DRIVER_PICKUP' ? 'Menunggu Kurir' :
                                                order?.orderStatus[0]?.status === 'DRIVER_TO_OUTLET' ? 'Kurir dalam perjalanan' : order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Kurir sudah sampai di outlet'
                                                    : order?.orderStatus[0]?.status}</td>
                                            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div className='flex gap-2'>
                                                    <ConfirmAlert caption="Apakah anda yakin ingin menghapus alamat anda?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => alert(order?.id)}>
                                                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                    </ConfirmAlert>
                                                    <Link href={`/user/dashboard/settings/order/e/${order?.id}CNC${Date.now()}`} className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /></Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold">
                                        {isFetchingDataOrder ? 'Mohon tunggu...' : 'Data tidak tersedia'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='flex gap-2 justify-between py-2 px-2 items-center'>
                        <div className="w-1/2 flex">
                            <h1 className="text-neutral-400">Page {page} of {totalPages}</h1>
                        </div>
                        <div className="flex gap-2">
                            <ButtonCustom disabled={page === 1} rounded="rounded-2xl" btnColor="bg-orange-500" onClick={() => setPage((prev) => Math.max(prev - 1, 1))}>Sebelumnya</ButtonCustom>
                            <ButtonCustom disabled={page === totalPages} rounded="rounded-2xl" btnColor="bg-orange-500" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}>Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout>
        </>
    )
}