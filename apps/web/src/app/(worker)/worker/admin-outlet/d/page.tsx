'use client'

import HeaderMobile from "@/components/core/headerMobile"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardContent } from "@/components/ui/card"
import { useQuery, useMutation } from "@tanstack/react-query"
import { instance } from "@/utils/axiosInstance"
import authStore from "@/zustand/authstore"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/components/hooks/use-toast"
import { ConfirmAlert } from "@/components/core/confirmAlert"
import FilterWorker from "@/components/core/filter"
import Pagination from "@/components/core/pagination"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DeliveryRequest() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state.token);
    const email = authStore((state) => state.email);

    const notesSchema = Yup.object({
        notes: Yup.string().required("Notes are required"),
    });


    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState("date-asc");
    const [activeTab, setActiveTab] = useState("menungguPembayaran");
    const [dateFrom, setDateFrom] = useState(params.get('dateFrom') || null);
    const [dateUntil, setDateUntil] = useState(params.get('dateUntil') || null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
        mutationFn: async ( orderId : any) => {
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


    const totalPages = dataOrderDelivery?.totalPage || 1;

    return (
        <>
            <main className="w-full h-fit">
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
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="menungguPembayaran" onClick={() => { setActiveTab("menungguPembayaran"); setPage(1) }} >Menunggu Pembayaran</TabsTrigger>
                                    <TabsTrigger value="siapKirim" onClick={() => { setActiveTab("siapKirim"); setPage(1) }} >Siap Kirim</TabsTrigger>
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
                                            selectTab="menungguPembayaran"
                                        />
                                        {dataOrderDeliveryLoading && <div>Loading...</div>}
                                        {dataOrderDeliveryError && <div>Silahkan coba beberapa saat lagi.</div>}
                                        {dataOrderDelivery?.orders?.map((order: any) => (
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
                                        ))}
                                        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                    </CardContent>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </section >
            </main >
        </>
    )
}