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
import FilterWorker from "@/components/core/filter"
import Pagination from "@/components/core/pagination"
import ContentWebLayout from "@/components/core/webSessionContent"
import ButtonCustom from "@/components/core/button"
import SearchInputCustom from "@/components/core/searchBar"
import { FaPlus } from "react-icons/fa6"
import PaginationWebLayout from "@/components/core/paginationWebLayout"
import NoData from "@/components/core/noData"

export default function Page() {
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
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const limit = 5;

    const { data: dataOrderWashingProcess, refetch, isLoading: dataOrderWashingProcessLoading, isError: dataOrderWashingProcessError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get('/order/order-washing', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: activeTab,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessWashing, isPending } = useMutation({
        mutationFn: async (id: any) => {
            return await instance.post(`/order/washing-done/${id}`, { email }, {
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
            setIsDisabledSucces(true)
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


    const totalPages = dataOrderWashingProcess?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit md:hidden block">
                <section className="w-full h-fit">
                    <HeaderMobile />
                    <main className="w-full">
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> WASHING WORKER
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue={activeTab} className="fit">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="all" onClick={() => { setActiveTab("all"); setPage(1) }} >Semua</TabsTrigger>
                                    <TabsTrigger value="not-washed" onClick={() => { setActiveTab("not-washed"); setPage(1) }} >Belum Dicuci</TabsTrigger>
                                    <TabsTrigger value="in-washing" onClick={() => { setActiveTab("in-washing"); setPage(1) }} >Proses Cuci</TabsTrigger>
                                    <TabsTrigger value="done" onClick={() => { setActiveTab("done"); setPage(1) }}>Selesai</TabsTrigger>
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
                                        />
                                        {dataOrderWashingProcessLoading && <p>Loading...</p>}
                                        {dataOrderWashingProcessError && <p>Silahkan coba beberapa saat lagi.</p>}
                                        {dataOrderWashingProcess?.orders?.map((order: any) => {
                                            console.log(order?.isSolved)
                                            return (
                                                <section
                                                    key={order.id}
                                                    className="flex justify-between items-center border-b py-4"
                                                >
                                                    {order?.orderStatus[0]?.status !== 'IN_IRONING_PROCESS' ? (
                                                        <ConfirmAlert
                                                            colorConfirmation="blue"
                                                            caption={
                                                                order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                                    ? 'Order ini belum disetujui oleh admin untuk dilanjutkan'
                                                                    : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === true
                                                                        ? 'Apakah anda yakin ingin melakukan proses cuci pada order ini?'
                                                                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                            ? 'Apakah anda yakin ingin menyelesaikan proses pada order ini?'
                                                                            : ''
                                                            }
                                                            description={
                                                                order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                                    ? 'Silahkan hubungi admin'
                                                                    : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === true
                                                                        ? 'Pastikan anda memilih order yang tepat/benar'
                                                                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                            ? 'Pastikan anda memilih order yang tepat/benar'
                                                                            : ''
                                                            }
                                                            hideButtons={order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false}
                                                            onClick={() => {
                                                                if (order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isProcessed === false) {
                                                                    router.push(`/worker/washing-worker/order/c/${order?.id}`);
                                                                } else if (order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS' && order?.isProcessed === true) {
                                                                    handleProcessWashing(order?.id);
                                                                }
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
                                                                    <p className="text-xs text-gray-500">
                                                                        {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                                            ? 'Menunggu Persetujuan Admin'
                                                                            : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true
                                                                                ? 'Belum Dicuci'
                                                                                : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                                    ? 'Proses Cuci'
                                                                                    : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                                                                        ? 'Selesai'
                                                                                        : order?.orderStatus[0]?.status}
                                                                    </p>
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
                                                                    {order?.User?.firstName} {order?.User?.lastName}
                                                                </h2>
                                                                <p className="text-xs text-gray-500">
                                                                    {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                                        ? 'Menunggu Persetujuan Admin'
                                                                        : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true
                                                                            ? 'Belum Dicuci'
                                                                            : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                                ? 'Proses Cuci'
                                                                                : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                                                                    ? 'Selesai'
                                                                                    : order?.orderStatus[0]?.status}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                </section>
                                            )
                                        })}

                                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />

                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </section>
            </main>

            <ContentWebLayout caption='Pesanan'>
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
                            {dataOrderWashingProcess?.orders?.length > 0 ? (
                                dataOrderWashingProcess?.orders?.map((order: any, i: number) => {
                                    console.log(order?.orderStatus[0]?.status, '<< status')
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * limit + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName} {order?.User?.lastName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.OrderType?.type === 'Wash Only' ? 'Layanan Mencuci' : order?.OrderType?.type === 'Iron Only' ? 'Layanan Strika' : order?.OrderType?.type === 'Wash & Iron' ? 'Mencuci dan Setrika' : ''}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">
                                                {order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                    ? 'Menunggu Persetujuan Admin'
                                                    : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order.isSolved === true
                                                        ? 'Belum Dicuci'
                                                        : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                            ? 'Proses Cuci'
                                                            : order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'
                                                                ? 'Selesai'
                                                                : order?.orderStatus[0]?.status}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.createdAt.split('T')[0]} {order?.createdAt.split('T')[1].split('.')[0]}</td>
                                            <td className="py-4 px-6 hover:underline break-words">
                                                <ConfirmAlert disabled={order?.orderStatus[0]?.status === 'DRIVER_ARRIVED_AT_OUTLET' ? true : false} colorConfirmation="blue" caption={
                                                    order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                        ? 'Order ini belum disetujui oleh admin untuk dilanjutkan'
                                                        : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === true
                                                            ? 'Apakah anda yakin ingin melakukan proses cuci pada order ini?'
                                                            : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                ? 'Apakah anda yakin ingin menyelesaikan proses pada order ini?'
                                                                : ''
                                                }
                                                    description={
                                                        order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false
                                                            ? 'Silahkan hubungi admin'
                                                            : order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === true
                                                                ? 'Pastikan anda memilih order yang tepat/benar'
                                                                : order?.orderStatus[0]?.status === 'IN_WASHING_PROCESS'
                                                                    ? 'Pastikan anda memilih order yang tepat/benar'
                                                                    : ''
                                                    }
                                                    hideButtons={order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false}
                                                    onClick={() => {
                                                        if (order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isProcessed === false) {
                                                            router.push(`/worker/washing-worker/order/c/${order?.id}`);
                                                        } else {
                                                            handleProcessWashing(order?.id)
                                                        }
                                                    }}>
                                                    <button disabled={order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS'} className='text-sm disabled:text-neutral-500 text-blue-700 hover:text-blue-500'>
                                                        {order?.orderStatus[0]?.status === 'IN_IRONING_PROCESS' ? 'Selesai' : 'Selesaikan'}
                                                    </button>
                                                </ConfirmAlert>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center font-bold text-3xl text-neutral-300"><NoData /></td>
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