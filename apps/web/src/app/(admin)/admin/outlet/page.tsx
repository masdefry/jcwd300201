'use client'

import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/button";
import SearchInputCustom from "@/components/core/searchBar";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";
import HeaderMobile from "@/components/core/headerMobile";
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
import Loading from "@/components/core/loading";
export default function Page() {
    const token = authStore((state) => state?.token)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchItem, setSearchItem] = useState<string>(params.get('search') || '')
    const [sortStore, setSortStore] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()

    const { data: dataItem, isFetching, refetch } = useQuery({
        queryKey: ['get-data-outlet', searchItem, sortStore],
        queryFn: async () => {
            const response = await instance.get('/store/stores', {
                params: {
                    search: searchItem,
                    page: currentPage,
                    sort: sortStore
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response?.data?.data
        }
    })


    const getDataStore = dataItem?.findStore
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

        if (sortStore) {
            currentUrl.set('sort', sortStore)
        } else {
            currentUrl.delete('sort')
        }

        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        router.refresh()
        refetch()

    }, [params, refetch, pathname, currentPage, totalPages, entriesPerPage, sortStore])

    return (
        <>
            <HeaderMobile />
            <main className="mx-8">
                <section className="flex justify-between bg-white w-full pr-14 font-bold fixed pt-16 text-lg border-b-2 pb-4">
                    <div className="flex items-center gap-2"> <Link href='/admin/settings'><FaArrowLeft /></Link> OUTLET</div>
                    <div> <ButtonCustom btnColor="bg-blue-500">+ Tambah Outlet</ButtonCustom> </div>
                </section>
                <div className="py-32 space-y-4">
                    {getDataStore?.length > 0 ? (
                        getDataStore?.map((store: any, i: number) => {
                            const address = `${store?.address}, ${store?.city}, ${store?.province}`
                            return (< div
                                key={i}
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
                                        <h2 className="font-medium text-gray-900">{store?.storeName?.toUpperCase()}</h2>
                                        <p className="text-xs text-gray-500">{address?.length > 50 ? `${address?.slice(0, 50)}..` : address}</p>
                                        <p className="text-xs text-gray-500">{new Date(store?.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-1">
                                    <button className="flex items-center justify-center space-x-2 px-2 py-2 w-12 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                        <FaEdit />
                                    </button>
                                    <button className="flex items-center space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <div className="flex items-center justify-center space-x-2 px-2 py-2 w-9  bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
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
                            )
                        })
                    ) : (
                        <div>
                            <div className="text-center py-20 font-bold">{isFetching ? <Loading/> : 'Data tidak tersedia'}</div>
                        </div>
                    )}
                </div>
            </main >
            {/* web */}
            < ContentWebLayout caption='Data Outlet' >
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center">
                        <select name="searchWorker"
                            value={sortStore} onChange={(e) => setSortStore(e.target.value)}
                            id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="name-asc">Sort berdasarkan A - Z</option>
                            <option value="name-desc">Sort berdasarkan Z - A</option>
                            <option value="">Reset</option>
                        </select>
                    </div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                        <ButtonCustom onClick={() => router.push('/admin/outlet/c')} rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500"><FaPlus /> Tambah outlet baru</ButtonCustom>
                    </div>
                </div>

                {/* table */}
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Alamat</th>
                                <th className="py-3 px-6 text-sm font-bold text-gray-600 uppercase text-center">Tanggal dibuat</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getDataStore?.length > 0 ? (
                                getDataStore?.map((store: any, i: number) => {
                                    const address = `${store?.address}, ${store?.city}, ${store?.province}`
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={store?.id || i}>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{store?.storeName?.toUpperCase()}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{address?.length > 50 ? `${address?.slice(0, 50)}..` : address}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words text-center">{new Date(store?.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div className='flex gap-2'>
                                                    <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                    <button className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /> </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold">{isFetching ? <Loading/> : 'Data tidak tersedia'}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className='flex gap-2 justify-between py-2 px-2 items-center'>
                        <div className="w-1/2 flex">
                            <h1 className="text-neutral-400">Page {currentPage} of {totalPages || '0'}</h1>
                        </div>
                        <div className="flex gap-2">
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                                disabled={currentPage == 1} onClick={() => handlePageChange(currentPage - 1)}
                            >Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500"
                                disabled={currentPage == totalPages || currentPage > totalPages} onClick={() => handlePageChange(currentPage + 1)}
                            >Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout >
        </>
    );
}