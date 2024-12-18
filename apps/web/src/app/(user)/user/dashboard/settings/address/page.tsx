'use client'

import ButtonCustom from "@/components/core/button";
import { RiShutDownLine } from "react-icons/ri";
import { FaUser, FaStore, FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import Image from "next/image";
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
import Link from "next/link";
import HeaderMobileUser from "@/components/core/headerMobileUser";
import ContentWebSession from "@/components/core/webSessionContent";
import SearchInputCustom from "@/components/core/searchBar";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
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

    const { data: getDataItem, isFetching, refetch, isPending } = useQuery({
        queryKey: ['get-data-item'],
        queryFn: async () => {
            const response = await instance.get('/user/all-address', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response?.data?.data
        }
    })

    // const { mutate: createProductItem, isPending } = useMutation({
    //     mutationFn: async ({ itemName }: { itemName: string }) => {
    //         return await instance.post('/worker/laundry-items', { itemName }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //     },
    //     onSuccess: (res) => {

    //         toast({
    //             description: res?.data?.message,
    //             className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
    //         })
    //         refetch()
    //         console.log(res)
    //     },
    //     onError: (err: any) => {
    //         toast({
    //             description: err?.response?.data?.message,
    //             className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
    //         })
    //         console.log(err)
    //     }
    // })

    // const { mutate: handleDeleteItem, isPending: isPendingDelete } = useMutation({
    //     mutationFn: async (id: number) => {
    //         return await instance.delete(`/worker/laundry-items/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //     },
    //     onSuccess: (res) => {
    //         toast({
    //             description: res?.data?.message,
    //             className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
    //         })

    //         refetch()
    //         console.log(res)
    //     },
    //     onError: (err: any) => {
    //         toast({
    //             description: err?.response?.data?.message,
    //             className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
    //         })
    //         console.log(err)
    //     }
    // })


    // const { mutate: handleUpdateItem, isPending: isPendingUpdate } = useMutation({
    //     mutationFn: async ({ id, itemName }: { id: string, itemName: string }) => {
    //         return await instance.patch(`/worker/laundry-items/${id}`, { itemName }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //     },
    //     onSuccess: (res) => {
    //         toast({
    //             description: res?.data?.message,
    //             className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
    //         })

    //         refetch()
    //         console.log(res)
    //     },
    //     onError: (err: any) => {
    //         toast({
    //             description: err?.response?.data?.message,
    //             className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
    //         })
    //         console.log(err)
    //     }
    // })



    // const getDataItem = dataItem?.findItem
    // const totalPages = dataItem?.totalPage

    // const handlePageChange = (page: any) => {
    //     setCurrentPage(page)
    // }

    const debounce = useDebouncedCallback((value) => {
        console.log(value)
    }, 1000)

    useEffect(() => {
        // if (searchItem) {
        //     currentUrl.set('search', searchItem)
        // } else {
        //     currentUrl.delete('search')
        // }

        // if (sortProduct) {
        //     currentUrl.set('sort', sortProduct)
        // } else {
        //     currentUrl.delete('sort')
        // }

        // if (totalPages === undefined || currentPage > totalPages) {
        //     setCurrentPage(1)
        // }

        // router.push(`${pathname}?${currentUrl.toString()}`)
        // router.refresh()
        // refetch()

        console.log('Gokks')

    }, [])


    const settingsItems = [
        { name: 'nama alamat', description: 'jl.rorojonggrang', icon: FaUser },
        { name: 'nama alamat', description: 'alamat outlet', icon: FaStore },
        { name: 'nama alamat', description: 'alamat outlet', icon: FaStore },
    ];


    return (
        <>
            <HeaderMobileUser />
            <main className="mx-8 md:hidden block">
                <section className="flex justify-between bg-white w-full pr-14 font-bold fixed pt-16 text-lg border-b-2 pb-4">
                    <div className="flex items-center gap-2"> <Link href='/users/settings'><FaArrowLeft /></Link> Alamat</div>
                    <div> <ButtonCustom btnColor="bg-orange-500">+ Tambah Alamat</ButtonCustom> </div>
                </section>
                <div className="py-32 space-y-4">
                    {settingsItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-1 bg-orange-400 rounded-lg">
                                    <Image
                                        src="https://img.freepik.com/premium-vector/shopping-store-building-icon-vector_620118-14.jpg?semt=ais_hybrid"
                                        alt="store"
                                        height={200}
                                        width={200}
                                        className="h-10 w-10 rounded-lg object-cover"
                                    />
                                </div>
                                <div className="ml-2">
                                    <h2 className="font-medium text-gray-900">{item.name}</h2>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                    <p className="text-xs text-gray-500">+62 8464654653515</p>
                                </div>
                            </div>

                            <div className="flex space-x-1">
                                <button className="flex items-center space-x-2 px-2 py-0 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                    <FaEdit />
                                </button>
                                <button className="flex items-center space-x-2 px-0 py-0 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <div className="flex items-center h-fit space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                                <FaTrashAlt />
                                            </div>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Hapus &quot;Nama Outlet&quot;?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Semua data yang berkaitan dengan outlet ini akan ikut terhapus.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                                <AlertDialogAction>Hapus</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <ContentWebSession caption="Alamat Saya">
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center">
                        <select name="searchWorker"
                            value={sortProduct} onChange={(e) => setSortProduct(e.target.value)}
                            id="searchWorker" className="px-4 py-2 focus:outline-none focus:border-orange-500 border rounded-2xl border-gray-300 text-sm text-neutral-600">
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
                        <ButtonCustom onClick={() => router.push('/user/dashboard/settings/address/c')} rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500"><FaPlus /> Buat Data Produk</ButtonCustom>
                    </div>
                </div>

                {/* table */}
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Alamat</th>
                                <th className="py-3 px-6 text-sm font-bold text-gray-600 uppercase">Kode Pos</th>
                                <th className="py-3 px-6 text-sm font-bold text-gray-600 uppercase">Negara</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getDataItem?.length > 0 ? (
                                getDataItem?.map((address: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={address?.id || i}>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{address?.addressDetail}, {address?.city}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words text-center">{address?.zipCode}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words text-center">{address?.country}</td>
                                            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div className='flex gap-2'>
                                                    {/* <ConfirmAlert disabled={isPendingDelete} caption="menghapus data ini" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => handleDeleteItem(address?.id)}> */}
                                                    <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                    {/* </ConfirmAlert> */}
                                                    <Link href={`/user/dashboard/settings/address/e/${address?.id}CNC${Date.now()}`} className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /></Link>
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
                            <h1 className="text-neutral-400">Page {currentPage} of 0</h1>
                        </div>
                        <div className="flex gap-2">
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                            // disabled={currentPage == 1} onClick={() => handlePageChange(currentPage - 1)}
                            >Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                            // disabled={currentPage == totalPages || currentPage > totalPages} onClick={() => handlePageChange(currentPage + 1)}
                            >Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebSession>
        </>
    );

}