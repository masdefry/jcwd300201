'use client'

import ButtonCustom from "@/components/core/button";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";


export default function Page() {
    const token = authStore((state) => state?.token)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchItem, setSearchItem] = useState<string>(params.get('search') || '')
    const router = useRouter()
    const pathname = usePathname()

    console.log(searchItem, '<<<<')

    const { data: dataItem, isFetching, refetch } = useQuery({
        queryKey: ['get-data-item', searchItem],
        queryFn: async () => {
            const response = await instance.get('/worker/item', {
                params: {
                    search: searchItem,
                    page: currentPage
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

        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        router.refresh()
        refetch()

    }, [params, refetch, pathname, currentPage, totalPages, entriesPerPage])

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
                            {/* <div className="w-1/2 h-fit flex items-center">
                                <select name="searchWorker"
                                    // value={sortWorker} onChange={(e) => setSortWorker(e.target.value)}
                                    id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                                    <option value="" disabled>-- Pilih Opsi --</option>
                                    <option value="super_admin">Sort berdasarkan SUPER_ADMIN</option>
                                    <option value="outlet_admin">Sort berdasarkan OUTLET_ADMIN</option>
                                    <option value="washing_worker">Sort berdasarkan WASHING_WORKER</option>
                                    <option value="ironing_worker">Sort berdasarkan IRONING_WORKER</option>
                                    <option value="packing_worker">Sort berdasarkan PACKING_WORKER</option>
                                    <option value="driver">Sort berdasarkan DRIVER</option>
                                    <option value="">Reset</option>
                                </select>
                            </div> */}
                            <div className="w-1/2 h-fit flex gap-2 justify-end">
                                <div className="relative flex">
                                    <input
                                        onChange={(e) => debounce(e.target.value)}
                                        type="text" className="px-3 py-2 border rounded-2xl text-sm focus:outline-none focus:outline-orange-500" placeholder="Cari pekerja.." />
                                    <span className='absolute top-3 right-5 text-neutral-500'><FaSearch /> </span>
                                </div>
                                <Link href='/admin/worker/c'>
                                    <ButtonCustom rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 disabled:bg-neutral-400"><FaPlus /> Buat Data Pekerja</ButtonCustom>
                                </Link>
                            </div>
                        </div>

                        {/* table */}
                        <div className="w-1/2 flex flex-col justify-center">
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
    );
}