'use client'

import { FaEdit, FaEye, FaSearch } from 'react-icons/fa';
import Link from "next/link"
import { FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import ButtonCustom from "@/components/core/buttonCustom";
import { ChangeEvent } from "react";
import SearchInputCustom from "@/components/core/searchBarCustom";
import { useWorkerHook } from "@/features/superAdmin/hooks/useWorkerHook";
import ContentWebLayout from "@/components/core/webSessionContent";
import PaginationWebLayout from "@/components/core/paginationWebLayout";
import Loading from "@/components/core/loadingCustom";
import NoData from "@/components/core/noDataCustom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Pagination from "@/components/core/paginationCustom";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import { MdWorkHistory } from "react-icons/md";
import { ConfirmAlert } from '@/components/core/confirmAlertCustom';
import { BsTrash } from 'react-icons/bs';
import { IWorker } from './type';

export default function Page() {
    const { currentPage, entriesPerPage, sortWorker, setSortWorker, isFetching, handleDeleteData, isPendingDelete,
        dataWorker, totalPages, handlePageChange, debounce, setCurrentPage, isValueSearch, isLoading, setIsValueSearch, router } = useWorkerHook()

    return (
        <>
            <ContentMobileLayout title='Data Pekerja' icon={<MdWorkHistory className="text-lg" />}>
                <div className="w-full flex gap-2 items-center pb-28">
                    <div className="flex w-full items-center justify-center">
                        <div className="relative w-full">
                            <input
                                type="text"
                                onChange={(e) => {
                                    setIsValueSearch(e.target.value)
                                    debounce(e.target.value)
                                }}
                                value={isValueSearch || ''}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border z-0 text-sm border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                    <ButtonCustom onClick={() => router.push('/admin/worker/c')} py='py-3' rounded="rounded-xl flex items-center" btnColor="bg-orange-500" width="w-fit"><FaPlus className="text-sm" /></ButtonCustom>
                    <div className="w-fit py-2 flex items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button><FaEllipsisVertical className="text-xl" /></button>
                            </DialogTrigger>
                            <DialogContent className="w-fit rounded-xl p-4 px-5 pb-5">
                                <DialogHeader>
                                    <DialogTitle className="text-lg text-left font-semibold">Sortir Data</DialogTitle>
                                    <DialogDescription className="text-sm text-center text-gray-500"></DialogDescription>
                                </DialogHeader>
                                <section className="gap-2 bg-white space-y-2 w-full h-fit justify-center items-center">
                                    <select name="searchWorker"
                                        value={sortWorker} onChange={(e) => setSortWorker(e.target.value)}
                                        id="searchWorker" className="w-full px-4 py-2 h-fit border rounded-lg border-gray-300 text-sm text-neutral-600">
                                        <option value="" disabled>-- Pilih Opsi --</option>
                                        <option value="super_admin">Sort berdasarkan Super Admin</option>
                                        <option value="outlet_admin">Sort berdasarkan Outlet Admin</option>
                                        <option value="washing_worker">Sort berdasarkan Washing Worker</option>
                                        <option value="ironing_worker">Sort berdasarkan Ironing Worker</option>
                                        <option value="packing_worker">Sort berdasarkan Packing Worker</option>
                                        <option value="driver">Sort berdasarkan Driver</option>
                                        <option value="">Reset</option>
                                    </select>
                                </section>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {isLoading && <Loading />}

                {!isLoading && dataWorker?.length > 0 ? (
                    dataWorker?.map((worker: IWorker, i: number) => {
                        return (< div
                            key={i}
                            className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <div className="ml-2">
                                    <h2 className="font-medium text-gray-900">{worker?.firstName}</h2>
                                    <p className="text-xs text-gray-500">{worker?.email}</p>
                                    <p className="text-xs text-gray-500">{worker?.phoneNumber}</p>
                                    <p className="text-xs text-gray-500">{worker?.workerRole}</p>
                                </div>
                            </div>

                            <div className="flex space-x-1">
                                <Link href={`/admin/worker/detail/${worker?.id}`} className="flex items-center space-x-2 px-2 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg">
                                    <FaEdit />
                                </Link>
                            </div>
                        </div>
                        )
                    })
                ) : (
                    <div>
                        <div className="text-center py-20 font-bold">{isLoading ? <Loading /> : <NoData />}</div>
                    </div>
                )}
                <Pagination page={currentPage} setPage={setCurrentPage} totalPages={totalPages} />
            </ContentMobileLayout>
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
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setIsValueSearch(e.target.value)
                            debounce(e.target.value)
                        }} />
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
                                dataWorker?.map((worker: IWorker, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={worker?.id || i}>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.firstName}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.email}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.phoneNumber}</td>
                                            <td className="py-4 px-6 text-sm text-gray-600 break-words">{worker?.workerRole}</td>
                                            <td className="py-4 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div className='flex gap-2'>
                                                    <ConfirmAlert disabled={isPendingDelete}
                                                        caption={`Hapus "${worker?.firstName?.toUpperCase()} ${worker?.lastName?.toUpperCase()}"?`}
                                                        description='Semua data yang berkaitan dengan outlet ini akan ikut terhapus.'
                                                        onClick={() => handleDeleteData(worker?.id)}>
                                                        <button disabled={isPendingDelete} className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                    </ConfirmAlert>
                                                    <Link className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl" href={`/admin/worker/detail/${worker?.id}`}><FaEye className="text-white" /></Link>
                                                </div>

                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-20 font-bold">{isLoading ? <Loading /> : <NoData />}</td>
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