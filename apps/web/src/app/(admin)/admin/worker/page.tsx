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
import ButtonCustom from "@/components/core/button";
import { ChangeEvent } from "react";
import SearchInputCustom from "@/components/core/searchBar";
import { useWorkerHooks } from "@/features/superAdmin/hooks/useWorkerHooks";
import ContentWebLayout from "@/components/core/webSessionContent";
import PaginationWebLayout from "@/components/core/paginationWebLayout";

export default function Page() {
    const { currentPage, entriesPerPage, sortWorker, setSortWorker, isFetching,
        dataWorker, totalPages, handlePageChange, debounce } = useWorkerHooks()

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
            <ContentWebLayout caption='Data Pekerja'>
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
                    <PaginationWebLayout currentPage={currentPage} totalPages={totalPages || '1'}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={currentPage == 1} onClick={() => handlePageChange(currentPage - 1)}>Sebelumnya</ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={currentPage == totalPages || currentPage > totalPages} onClick={() => handlePageChange(currentPage + 1)}>Selanjutnya</ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    )
}