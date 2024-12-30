'use client'

import { Card, CardContent } from "@/components/ui/card"
import { FaEdit, FaSearch, FaTrashAlt } from 'react-icons/fa';
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
import { BsTrash } from "react-icons/bs";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import Loading from "@/components/core/loading";
import NoData from "@/components/core/noData";

export default function Page() {
    const { currentPage, entriesPerPage, sortWorker, setSortWorker, isFetching,
        dataWorker, totalPages, handlePageChange, debounce, searchWorker, isLoading } = useWorkerHooks()

    return (
        <>
            <HeaderMobile />

            <main className="mx-8 md:hidden block">
                <section className="flex justify-between bg-white w-full pr-14 font-bold fixed pt-16 text-lg border-b-2 pb-4">
                    <div className="flex items-center gap-2"> <Link href='/admin/settings'><FaArrowLeft /></Link> WORKER</div>
                    <div> <ButtonCustom btnColor="bg-blue-500">+ Tambah Worker</ButtonCustom> </div>
                </section>
                <div className="py-32 space-y-4">
                    <div className="w-full flex justify-between gap-1 items-center">
                        <div className="w-1/2 flex justify-between gap-1 items-center">
                            <div className="flex items-center justify-center">
                                <div className="relative w-full max-w-md">
                                    <input
                                        type="text"
                                        onChange={(e) => debounce(e.target.value)}
                                        value={searchWorker}
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-4 py-2 border z-0 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <select name="searchWorker"
                            value={sortWorker} onChange={(e) => setSortWorker(e.target.value)}
                            id="searchWorker" className="w-1/2 px-4 py-2 h-10 border rounded-lg border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="super_admin">Sort berdasarkan Super Admin</option>
                            <option value="outlet_admin">Sort berdasarkan Outlet Admin</option>
                            <option value="washing_worker">Sort berdasarkan Washing Worker</option>
                            <option value="ironing_worker">Sort berdasarkan Ironing Worker</option>
                            <option value="packing_worker">Sort berdasarkan Packing Worker</option>
                            <option value="driver">Sort berdasarkan Driver</option>
                            <option value="">Reset</option>
                        </select>
                    </div>

                    {dataWorker?.length > 0 ? (
                        dataWorker?.map((worker: any, i: number) => {
                            return (< div
                                key={i}
                                className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    <div className="ml-2">
                                        <h2 className="font-medium text-gray-900">{ worker?.firstName}</h2>
                                        <p className="text-xs text-gray-500">{worker?.email}</p>
                                        <p className="text-xs text-gray-500">{worker?.phoneNumber}</p>
                                        <p className="text-xs text-gray-500">{worker?.workerRole}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-1">
                                    <button className="flex items-center justify-center space-x-2 px-2 py-2 w-12 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                        <FaEdit />
                                    </button>
                                    <button className="flex items-center space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                        <ConfirmAlert
                                            caption={`Hapus "${worker?.firstName.toUpperCase()}"?`}
                                            description='Semua data yang berkaitan dengan outlet ini akan ikut terhapus.'
                                            onClick={() => { console.log('delete') }}>
                                            <div className="flex items-center justify-center space-x-2 px-2 py-2 w-9  bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                                <BsTrash />
                                            </div>
                                        </ConfirmAlert>
                                    </button>

                                </div>
                            </div>
                            )
                        })
                    ) : (
                        <div>
                            <div className="text-center py-20 font-bold">{isLoading ? <Loading /> : <NoData />}</div>
                        </div>
                    )}
                </div>
            </main>

            {/* web */}
            <ContentWebLayout caption='Data Pekerja'>
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center">
                        <select name="searchWorker" value={sortWorker} onChange={(e) => setSortWorker(e.target.value)} id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="super_admin">Sort berdasarkan Super Admin</option>
                            <option value="outlet_admin">Sort berdasarkan Outlet Admin</option>
                            <option value="washing_worker">Sort berdasarkan Washing Worker</option>
                            <option value="ironing_worker">Sort berdasarkan Ironing Worker</option>
                            <option value="packing_worker">Sort berdasarkan Packing Worker</option>
                            <option value="driver">Sort berdasarkan Driver</option>
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