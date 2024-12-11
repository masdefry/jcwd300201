'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeaderMobile from "@/components/core/headerMobile"
import { FaArrowLeft } from 'react-icons/fa';
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import LocationAndSearch from "@/features/workerData/components/locationAndSearch";
import { FaPlus } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import Image from "next/image";
import ButtonCustom from "@/components/core/button";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import SearchInputCustom from "@/components/core/searchBar";

export default function Page() {
    const params = useSearchParams()
    const currentParams = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchWorker, setSearchWorker] = useState<string>(params.get('search') || '')
    const [sortWorker, setSortWorker] = useState<string>(params.get('sort') || '')
    const router = useRouter()
    const pathname = usePathname()

    const { data: getDataWorker, refetch, isFetching } = useQuery({
        queryKey: ['get-data-worker', searchWorker, sortWorker],
        queryFn: async () => {
            const response = await instance.get('/admin/worker', {
                params: {
                    search: searchWorker,
                    sort: sortWorker,
                    page: currentPage,
                    limit: entriesPerPage
                }
            })

            return response?.data?.data
        }
    })

    const dataWorker = getDataWorker?.findWorker
    const totalPages = getDataWorker?.totalPages

    const handlePageChange = (page: any) => {
        setCurrentPage(page)
    }

    const debounce = useDebouncedCallback((value) => {
        setSearchWorker(value)
    }, 1000)

    useEffect(() => {
        if (searchWorker) {
            currentParams.set('search', searchWorker)
        } else {
            currentParams.delete('search')
        }

        if (sortWorker) {
            currentParams.set('sort', sortWorker)
        } else {
            currentParams.delete('sort')
        }

        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${currentParams.toString()}`)
        router.refresh()
        refetch()

    }, [params, searchWorker, sortWorker, refetch, pathname, currentPage, totalPages, entriesPerPage])

    return (
        <>
            <main className="w-full h-fit">
                <section className="w-full h-fit max-w-[425px] md:max-w-full md:w-full block md:hidden">
                    <HeaderMobile />
                    <main className="w-fit mx-8">
                        <section className="flex gap-2 items-center bg-white font-bold w-full fixed pt-16 text-lg border-b-2 pb-4">
                            <Link href='/admin/settings'><FaArrowLeft /></Link> PEKERJA
                        </section>
                        <div className="py-28 space-y-4">
                            <Tabs defaultValue="semua" className="fit">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="semua">Semua</TabsTrigger>
                                    <TabsTrigger value="pekerja">Pekerja</TabsTrigger>
                                    <TabsTrigger value="driver">Driver</TabsTrigger>
                                </TabsList>
                                <TabsContent value="semua">
                                    <Card>
                                        <CardContent className="space-y-2 pt-4">
                                            <LocationAndSearch />
                                            <section className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 p-1">
                                                        <Avatar>
                                                            <AvatarImage src="https://github.com/shadcn.png" />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
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
                                                </div>
                                            </section>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="pekerja">
                                    <Card>
                                        <CardContent className="space-y-2 pt-4">
                                            <LocationAndSearch />
                                            <section className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 p-1">
                                                        <Avatar>
                                                            <AvatarImage src="https://github.com/shadcn.png" />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
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
                                                </div>
                                            </section>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="Driver">
                                    <Card>
                                        <CardContent className="space-y-2 pt-4">
                                            <LocationAndSearch />
                                            <section className="flex justify-between items-center">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 p-1">
                                                        <Avatar>
                                                            <AvatarImage src="https://github.com/shadcn.png" />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
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
                                                </div>
                                            </section>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </main>
                </section>
            </main>

            {/* web */}
            <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
                <section className="w-full flex p-4 rounded-xl h-full bg-white">
                    <div className="flex flex-col w-full gap-5">
                        <div className="w-full py-4 bg-orange-500 px-14 rounded-xl">
                            <h1 className="font-bold text-white">Data Pekerja</h1>
                        </div>

                        <div className="w-full h-fit flex">
                            <div className="w-1/2 h-fit flex items-center">
                                <select name="searchWorker" value={sortWorker} onChange={(e) => setSortWorker(e.target.value)} id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                                    <option value="" disabled>-- Pilih Opsi --</option>
                                    <option value="super_admin">Sort berdasarkan SUPER_ADMIN</option>
                                    <option value="outlet_admin">Sort berdasarkan OUTLET_ADMIN</option>
                                    <option value="washing_worker">Sort berdasarkan WASHING_WORKER</option>
                                    <option value="ironing_worker">Sort berdasarkan IRONING_WORKER</option>
                                    <option value="packing_worker">Sort berdasarkan PACKING_WORKER</option>
                                    <option value="driver">Sort berdasarkan DRIVER</option>
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
                                        <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Email</th>
                                        <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Phone Number</th>
                                        <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Worker Role</th>
                                        <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataWorker?.length > 0 ? (
                                        dataWorker?.map((worker: any, i: number) => {
                                            return (
                                                <tr className="hover:bg-gray-100 border-b" key={worker?.id || i}>
                                                    <td className="py-4 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.firstName}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.email}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.phoneNumber}</td>
                                                    <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.workerRole}</td>
                                                    <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                        <Link href={`/admin/worker/detail/${worker?.id}`}>View</Link>
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
                                    <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500 disabled:bg-neutral-400" disabled={currentPage == 1} onClick={() => handlePageChange(currentPage - 1)}>Sebelumnya</ButtonCustom>
                                    <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500 disabled:bg-neutral-400" disabled={currentPage == totalPages || currentPage > totalPages} onClick={() => handlePageChange(currentPage + 1)}>Selanjutnya</ButtonCustom>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}