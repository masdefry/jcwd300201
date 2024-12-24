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
import ContentWebLayout from "@/components/core/webSessionContent"
import PaginationWebLayout from "@/features/superAdmin/components/paginationWebLayout"
import ButtonCustom from "@/components/core/button"
import SearchInputCustom from "@/components/core/searchBar"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import { BsTrash } from "react-icons/bs"

export default function HistoryOrderWashing() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "semua");
    const [dateFrom, setDateFrom] = useState(params.get('dateFrom') || null);
    const [dateUntil, setDateUntil] = useState(params.get('dateUntil') || null);
    const limit = 5;

    const { data: dataCreateOrder, refetch, isLoading: dataCreateOrderLoading, isError: dataCreateOrderError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption],
        queryFn: async () => {

            const res = await instance.get('/order/nota-order', {
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


    const totalPages = dataCreateOrder?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit md:hidden block">
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
                                {dataCreateOrderLoading && <p>Loading...</p>}
                                {dataCreateOrderError && <p>Silahkan coba beberapa saat lagi.</p>}
                                {dataCreateOrder?.orders?.map((order: any) => {
                                    console.log(order?.isSolved)
                                    return (
                                        <section
                                            key={order.id}
                                            className="flex justify-between items-center border-b py-4"
                                        >
                                            <Link href={`/worker/admin-outlet/c/${order?.id}`}>
                                                <div className="flex items-center">
                                                    <div className="ml-2">
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.id}
                                                        </h2>
                                                        <h2 className="font-medium text-gray-900">
                                                            {order?.User?.firstName} {order?.User?.lastName}
                                                        </h2>
                                                        <p className="text-xs text-gray-500">
                                                            {order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? 'Menunggu Pembuatan Nota Order' :
                                                                ""}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</p>
                                                    </div>
                                                </div>
                                            </Link>

                                            <div className="flex gap-1">
                                                <Link href={`https://wa.me/62${order.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                                    <FaWhatsapp />
                                                </Link>
                                            </div>
                                        </section>
                                    )
                                })}

                                <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                            </CardContent>
                        </div>
                    </main>
                </section>
            </main>

            <ContentWebLayout caption='Nota Pesanan'>
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center">
                        <select name="searchWorker"
                            // value={sortProduct} onChange={(e) => setSortProduct(e.target.value)}
                            id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="name-asc">Sort berdasarkan A - Z</option>
                            <option value="name-desc">Sort berdasarkan Z - A</option>
                            <option value="latest-item">Sort berdasarkan data terbaru</option>
                            <option value="oldest-item">Sort berdasarkan data terlama</option>
                            <option value="">Reset</option>
                        </select>
                    </div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                        {/* <DialogCreateProduct createProductItem={createProductItem} isPending={isPending} /> */}
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-sm font-bold text-gray-600 uppercase text-center">Tanggal dibuat</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataCreateOrder?.orders?.length > 0 ? (
                                dataCreateOrder?.orders?.map((prod: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={prod?.id || i}>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{prod?.itemName}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words text-center">{new Date(prod?.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div className='flex gap-2'>
                                                    <ConfirmAlert 
                                                    // disabled={isPendingDelete} 
                                                    caption="Apakah anda yakin ingin menghapus data ini?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => alert(prod?.id)}>
                                                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                    </ConfirmAlert>
                                                    {/* <DialogUpdateProduct handleUpdateItem={handleUpdateItem} product={prod} isPendingUpdate={isPendingUpdate} /> */}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold">tes</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <PaginationWebLayout currentPage={page} totalPages={totalPages}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => alert(page - 1)}>
                            Sebelumnya
                        </ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => alert(page + 1)}>
                            Selanjutnya
                        </ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}