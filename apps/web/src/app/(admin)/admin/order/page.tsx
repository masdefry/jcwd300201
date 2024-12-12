'use client'

import ButtonCustom from "@/components/core/button";
import SearchInputCustom from "@/components/core/searchBar";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FaArrowLeft, FaPlus } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";

import HeaderMobile from "@/components/core/headerMobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { CardContent } from "@/components/ui/card"
import LocationAndSearch from "@/features/workerData/components/locationAndSearch"
import { FaEdit } from 'react-icons/fa';
import ProcessAndSortDate from "@/features/order/components/processAndSortDate"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

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
            const response = await instance.get('/worker/item', {
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
            <main className="w-full h-fit">
                <section className="w-full h-fit max-w-[425px] md:max-w-full md:w-full block md:hidden">
                    <HeaderMobile />

                    <main className="w-full"> {/* Ensure the parent spans the full width */}
                        <section className="w-full fixed pt-16 text-lg pb-4 border-b-2 bg-white">
                            <div className="mx-8 flex gap-2 items-center font-bold w-full">
                                <Link href='/admin/settings'><FaArrowLeft /></Link> PESANAN
                            </div>
                        </section>
                        <div className="py-28 mx-4 space-y-4">
                            <Tabs defaultValue="semua" className="fit">
                                <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="semua">Semua</TabsTrigger>
                                    <TabsTrigger value="antrian">Antrian</TabsTrigger>
                                    <TabsTrigger value="proses">Proses</TabsTrigger>
                                    <TabsTrigger value="perjalanan">Perjalanan</TabsTrigger>
                                    <TabsTrigger value="selesai">Selesai</TabsTrigger>
                                </TabsList>
                                <TabsContent value="semua">
                                    <CardContent className="space-y-2 pt-2">
                                        <LocationAndSearch />
                                        <ProcessAndSortDate />

                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>

                                </TabsContent>
                                <TabsContent value="antrian">
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>

                                </TabsContent>
                                <TabsContent value="proses">
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>
                                </TabsContent>
                                <TabsContent value="perjalanan">
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>
                                </TabsContent>
                                <TabsContent value="selesai">
                                    <CardContent className="space-y-2 pt-4">
                                        <LocationAndSearch />
                                        <section className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 p-1">

                                                </div>
                                                <div className="ml-2">
                                                    <h2 className="font-medium text-gray-900">Nama Pekerja</h2>
                                                    <p className="text-xs text-gray-500">Jabatan</p>
                                                    <p className="text-xs text-gray-500">no Telp</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button className="flex items-center h-fit space-x-2 px-2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                                    <FaEdit />
                                                </button>


                                            </div>
                                        </section>
                                    </CardContent>
                                </TabsContent>
                            </Tabs>

                        </div>
                    </main>
                </section>
            </main>

            {/* web sesi */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex p-4 rounded-xl h-full bg-white">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Order List</h1>
                        </div>

                        <div className="w-full h-fit flex">
                            <div className="w-1/2 h-fit flex items-center">
                                <select name="searchWorker"
                                    value={sortProduct} onChange={(e) => setSortProduct(e.target.value)}
                                    id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                                    <option value="" disabled>-- Pilih Opsi --</option>
                                    <option value="name-asc">Sort berdasarkan A - Z</option>
                                    <option value="name-desc">Sort berdasarkan Z - A</option>
                                    <option value="">Reset</option>
                                </select>
                            </div>
                            <div className="w-1/2 h-fit flex gap-2 justify-end">
                                <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                                <Link href='/admin/worker/c'>
                                    <ButtonCustom rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 disabled:bg-neutral-400"><FaPlus /> Buat Data Pekerja</ButtonCustom>
                                </Link>
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
                                                    <td className="py-4 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600 break-words">{prod?.itemName}</td>
                                                    <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                        <Link href={`/admin/worker/detail/${prod?.id}`}>View</Link>
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
    )
}