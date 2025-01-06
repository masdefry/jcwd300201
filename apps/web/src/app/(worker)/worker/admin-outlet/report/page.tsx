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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Loading from "@/components/core/loading"
import NoData from "@/components/core/noData"
import MobileSessionLayout from "@/components/core/mobileSessionLayout/subMenuLayout"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ContentWebLayout from "@/components/core/webSessionContent"
import FilterWeb from "@/components/core/filterWeb"
import ButtonCustom from "@/components/core/button"

export default function DriverPickUp() {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);
    const notesSchema = Yup.object({
        notes: Yup.string().required("Harap diisi terlebih dahulu"),
    })
    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "bermasalah");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [isDisableSuccess, setIsDisableSuccess] = useState<boolean>(false);
    const [isSearchValues, setIsSearchValues] = useState<string>('')
    const limit = 5

    const { data: dataOrderPackingProcess, refetch, isLoading: dataOrderPackingProcessLoading, isError: dataOrderPackingProcessError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get(`/order/order-notes/`, {
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

    const { mutate: handleLaundryProblem, isPending } = useMutation({
        mutationFn: async ({ orderId, notes }: any) => {
            return await instance.patch(`/order/order-notes/${orderId}`, { notes }, {

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
            setIsDisableSuccess(true)
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
        if (page) {
            currentUrl.set('page', page?.toString())
        } else {
            currentUrl.delete('page')
        }
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderPackingProcess?.totalPage || 1
    const handlePageChange = (page: any) => setPage(page)


    return (
        <>
            <MobileSessionLayout title="Laporan Pesanan">
                <div className="space-y-4">
                    <Tabs defaultValue={activeTab} className="fit">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="bermasalah" onClick={() => { setActiveTab("bermasalah"); setPage(1) }} >Bermasalah</TabsTrigger>
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
                                    searchInput={searchInput}
                                    setPage={setPage}
                                    setIsSearchValues={setIsSearchValues}
                                    isSearchValues={isSearchValues}

                                />
                                {dataOrderPackingProcessLoading && <Loading />}
                                {dataOrderPackingProcessError && <div>Silahkan coba beberapa saat lagi.</div>}
                                {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                                    dataOrderPackingProcess?.orders?.map((order: any) => (
                                        <section key={order.id} className="flex justify-between items-center border-b py-4">
                                            {order?.notes && order?.isSolved === true ?
                                                <div className="flex items-center">
                                                    <div className="px-2">
                                                        <h2 className="font-medium text-gray-900">{order?.id}</h2>
                                                        <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                                                        <div className="text-xs text-gray-500">{order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false && order?.notes ? 'Terjadi Masalah' : ''}</div>
                                                        <div className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</div>
                                                    </div>
                                                </div> :
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <div className="flex items-center">
                                                            <div className="px-2">
                                                                <h2 className="font-medium text-gray-900">{order?.id}</h2>
                                                                <h2 className="font-medium text-gray-900">{order?.User?.firstName} {order?.User?.lastName}</h2>
                                                                <div className="text-xs text-gray-500">{order?.orderStatus[0]?.status === 'AWAITING_PAYMENT' && order?.isSolved === false && order?.notes ? 'Terjadi Masalah' : ''}</div>
                                                                <div className="text-xs text-gray-500">{order.createdAt.split('T')[0]} {order.createdAt.split('T')[1].split('.')[0]}</div>
                                                            </div>
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px]">
                                                        <DialogHeader>
                                                            <DialogTitle>Buat Catatan</DialogTitle>
                                                            <DialogDescription>
                                                                Beri catatan untuk memproses data pesanan pengguna.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <Formik initialValues={{ notes: '' }} validationSchema={notesSchema} onSubmit={(values) => {
                                                            handleLaundryProblem({ notes: values.notes, orderId: order?.id })
                                                        }}>
                                                            <Form className='relative py-2 pt-5'>
                                                                <Field
                                                                    as="textarea"
                                                                    name="notes"
                                                                    rows={4}
                                                                    placeholder="Enter your notes"
                                                                    className="w-full p-2 border rounded"
                                                                />
                                                                <ErrorMessage name="notes" component="div" className="text-red-500 text-xs absolute top-[-2px]" />
                                                                <DialogFooter>
                                                                    <ButtonCustom disabled={isPending || isDisableSuccess} width="w-full" btnColor='bg-orange-500 hover:bg-orange-500' type="submit">Save changes</ButtonCustom>
                                                                </DialogFooter>
                                                            </Form>
                                                        </Formik>
                                                    </DialogContent>
                                                </Dialog>}
                                            <div className="flex gap-1">
                                                <Link href={`https://wa.me/62${order.userPhoneNumber?.substring(1)}`} className="flex items-center h-fit space-x-2 px-3 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg">
                                                    <FaWhatsapp />
                                                </Link>
                                            </div>
                                        </section>
                                    ))
                                ) : (
                                    !dataOrderPackingProcessLoading && (
                                        <NoData />
                                    )

                                )}
                                {!dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 && (
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                )}
                            </CardContent>
                        </TabsContent>
                    </Tabs>
                </div>
            </MobileSessionLayout>

            <ContentWebLayout caption="Laporan Pesanan">
                <FilterWeb
                    debounce={debounce}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    dateFrom={dateFrom}
                    dateUntil={dateUntil}
                    setDateFrom={setDateFrom}
                    setDateUntil={setDateUntil}
                    setActiveTab={setActiveTab}
                    setSearchInput={setSearchInput}
                    searchInput={searchInput}
                    setPage={setPage}
                    setIsSearchValues={setIsSearchValues}
                    isSearchValues={isSearchValues}
                    activeTab={activeTab}
                    borderReset="border rounded-full"
                    options={[
                        { label: 'Bermasalah', value: 'bermasalah' },
                        { label: 'Selesai', value: 'done' },
                    ]}
                />

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Order ID</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Customer</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataOrderPackingProcessLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !dataOrderPackingProcessLoading && dataOrderPackingProcess?.orders?.length > 0 ? (
                                    dataOrderPackingProcess?.orders?.map((order: any, i: number) => (
                                        <tr className="hover:bg-gray-100 border-b" key={order?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(page - 1) * page + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.id}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.User?.firstName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{order?.isSolved === true ? 'Terselesaikan' : 'Masih terjadi masalah'}</td>
                                            <td className="py-4 px-6 text-sm hover:underline break-words">
                                                {order?.notes && order?.isSolved === true ?
                                                   <button disabled className="text-blue-700 hover:text-blue-500 disabled:text-neutral-400">View</button> :
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                          <button className='text-blue-700 hover:text-blue-500 disabled:text-neutral-400'>View</button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Buat Catatan</DialogTitle>
                                                                <DialogDescription>
                                                                    Beri catatan untuk memproses data pesanan pengguna.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <Formik initialValues={{ notes: '' }} validationSchema={notesSchema} onSubmit={(values) => {
                                                                handleLaundryProblem({ notes: values.notes, orderId: order?.id })
                                                            }}>
                                                                <Form className='relative py-2 pt-5'>
                                                                    <Field
                                                                        as="textarea"
                                                                        name="notes"
                                                                        rows={4}
                                                                        placeholder="Enter your notes"
                                                                        className="w-full p-2 border rounded"
                                                                    />
                                                                    <ErrorMessage name="notes" component="div" className="text-red-500 text-xs absolute top-[-2px]" />
                                                                    <DialogFooter>
                                                                        <ButtonCustom disabled={isPending || isDisableSuccess} width="w-full" btnColor='bg-orange-500 hover:bg-orange-500' type="submit">Save changes</ButtonCustom>
                                                                    </DialogFooter>
                                                                </Form>
                                                            </Formik>
                                                        </DialogContent>
                                                    </Dialog>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {dataOrderPackingProcessLoading ? <span className="py-10"><Loading /></span> : <NoData />}
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
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == 1} onClick={() => handlePageChange(page - 1)}>Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={page == totalPages || page > totalPages} onClick={() => handlePageChange(page + 1)}>Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout>
        </>
    )
}