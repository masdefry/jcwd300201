'use client'

import ButtonCustom from "@/components/core/button";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import SearchInputCustom from "@/components/core/searchBar";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup'
import { toast } from "@/components/hooks/use-toast";

export default function Page() {
    const token = authStore((state) => state?.token)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchItem, setSearchItem] = useState<string>(params.get('search') || '')
    const [sortProduct, setSortProduct] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()

    const { data: dataItem, isFetching, refetch } = useQuery({
        queryKey: ['get-data-item', searchItem],
        queryFn: async () => {
            const response = await instance.get('/admin/worker/item', {
                params: {
                    search: searchItem,
                    page: currentPage,
                    sort: sortProduct
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response?.data?.data
        }
    })

    const { mutate: createProductItem, isPending } = useMutation({
        mutationFn: async ({ itemName }: { itemName: string }) => {
            return await instance.post('/admin/worker/item', { itemName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {

            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            refetch()
            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            console.log(err)
        }
    })
    
    const { mutate: handleDeleteItem } = useMutation({
        mutationFn: async (id: number) => {
            return await instance.delete(`/admin/worker/item/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            refetch()
            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            console.log(err)
        }
    })

    const getDataItem = dataItem?.findItem
    const totalPages = dataItem?.totalPage

    const handlePageChange = (page: any) => {
        setCurrentPage(page)
    }

    const debounce = useDebouncedCallback((value) => {
        setSearchItem(value)
    }, 1000)

    useEffect(() => {
        if (searchItem) {
            currentUrl.set('search', searchItem)
        } else {
            currentUrl.delete('search')
        }

        if (sortProduct) {
            currentUrl.set('sort', sortProduct)
        } else {
            currentUrl.delete('sort')
        }

        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        router.refresh()
        refetch()

    }, [params, refetch, pathname, currentPage, totalPages, entriesPerPage, sortProduct])

    return (
        <>

            {/* web */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex p-4 rounded-xl h-full bg-white">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Product Laundry</h1>
                        </div>

                        <div className="w-full h-fit flex">
                            <div className="w-1/2 h-fit flex items-center">
                                <select name="searchWorker"
                                    value={sortProduct} onChange={(e) => setSortProduct(e.target.value)}
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <ButtonCustom rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 disabled:bg-neutral-400"><FaPlus /> Buat Data Produk</ButtonCustom>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Buat item baru</DialogTitle>
                                            <DialogDescription>
                                                Harap masukan nama produk atau item yang ingin ditambahkan.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="w-full">
                                            <Formik
                                                initialValues={{
                                                    itemName: ''
                                                }}
                                                validationSchema={
                                                    Yup.object().shape({
                                                        itemName: Yup.string().min(3, 'Harap masukan nama yang valid').required('harap diisi terlebih dahulu')
                                                    })
                                                }
                                                onSubmit={(values) => {
                                                    createProductItem({ itemName: values?.itemName })
                                                    console.log(values)
                                                }}>
                                                <Form className="w-full">
                                                    <div className="space-y-2 flex flex-col relative">
                                                        <label htmlFor="itemName" className="font-semibold">Nama Produk <span className="text-red-500">*</span></label>
                                                        <Field name='itemName' placeholder="Masukan Nama Item.."
                                                            className='border focus:outline-none py-2 px-4' />
                                                        <ErrorMessage component='div' className="text-red top-0 right-0 absolute text-xs text-red-500" name="itemName" />
                                                    </div>
                                                    <div className="py-2 w-full flex justify-end">
                                                        <ButtonCustom disabled={isPending} type="submit" rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 disabled:bg-neutral-400 text-sm">Tambah</ButtonCustom>
                                                    </div>
                                                </Form>
                                            </Formik>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                {/* <Link href='/admin/worker/c'>
                                </Link> */}
                            </div>
                        </div>

                        {/* table */}
                        <div className="w-full flex flex-col justify-center">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                        <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                        <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getDataItem?.length > 0 ? (
                                        getDataItem?.map((prod: any, i: number) => {
                                            return (
                                                <tr className="hover:bg-gray-100 border-b" key={prod?.id || i}>
                                                    <td className="py-2 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                                    <td className="py-2 px-6 text-sm text-gray-600 break-words">{prod?.itemName}</td>
                                                    <td className="py-2 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                        <div className='flex gap-2'>
                                                            <ConfirmAlert caption="menghapus data ini" description="Data akan dihapus secara permanen, harap teliti" onClick={() => handleDeleteItem(prod?.id)}>
                                                                <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                            </ConfirmAlert>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <button className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /> </button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[425px]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Edit item</DialogTitle>
                                                                        <DialogDescription>
                                                                            Harap masukan nama produk atau item yang ingin ditambahkan.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <div className="w-full">
                                                                        <Formik
                                                                            initialValues={{
                                                                                itemName: ''
                                                                            }}
                                                                            validationSchema={
                                                                                Yup.object().shape({
                                                                                    itemName: Yup.string().min(3, 'Harap masukan nama yang valid').required('harap diisi terlebih dahulu')
                                                                                })
                                                                            }
                                                                            onSubmit={(values) => {
                                                                                console.log(values)
                                                                            }}>
                                                                            <Form className="w-full">
                                                                                <div className="space-y-2 flex flex-col relative">
                                                                                    <label htmlFor="itemName" className="font-semibold">Nama Produk <span className="text-red-500">*</span></label>
                                                                                    <Field name='itemName' placeholder="Masukan Nama Item.."
                                                                                        className='border focus:outline-none py-2 px-4' />
                                                                                    <ErrorMessage component='div' className="text-red top-0 right-0 absolute text-xs text-red-500" name="itemName" />
                                                                                </div>
                                                                                <div className="py-2 w-full flex justify-end">
                                                                                    <ButtonCustom rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 disabled:bg-neutral-400 text-sm">Ubah</ButtonCustom>
                                                                                </div>
                                                                            </Form>
                                                                        </Formik>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-20 font-bold">{isFetching ? 'Mohon tunggu...' : 'Data tidak tersedia'}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='flex gap-2 justify-between py-2 px-2 items-center'>
                                <div className="w-1/2 flex">
                                    <h1 className="text-neutral-400">Page {currentPage} of {totalPages || '0'}</h1>
                                </div>
                                <div className="flex gap-2">
                                    <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500 disabled:bg-neutral-400"
                                        disabled={currentPage == 1} onClick={() => handlePageChange(currentPage - 1)}
                                    >Sebelumnya</ButtonCustom>
                                    <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500 disabled:bg-neutral-400"
                                        disabled={currentPage == totalPages || currentPage > totalPages} onClick={() => handlePageChange(currentPage + 1)}
                                    >Selanjutnya</ButtonCustom>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </>
    );
}