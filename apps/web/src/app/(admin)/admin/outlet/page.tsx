'use client'

import ContentWebLayout from "@/components/core/webSessionContent";
import ButtonCustom from "@/components/core/buttonCustom";
import SearchInputCustom from "@/components/core/searchBarCustom";
import { ChangeEvent } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FaEllipsisVertical, FaPlus, FaStore } from "react-icons/fa6";
import { FaSearch } from 'react-icons/fa';
import Image from "next/image";
import Link from "next/link";
import Loading from "@/components/core/loadingCustom";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import Pagination from "@/components/core/paginationCustom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import { useAdminStoreHook } from "@/features/superAdmin/hooks/useAdminStoreHook";
import NoData from "@/components/core/noDataCustom";
import { IStore } from "./type";

export default function Page() {
    const {
        isLoading,
        isPendingDelete,
        deleteStoreById,
        params,
        router,
        pathname,
        token,
        refetch,
        debounce, totalPages, isFetching,
        getDataStore,
        handlePageChange, entriesPerPage,
        searchItem, sortStore, currentPage,
        setSortStore, setCurrentPage, isError
    } = useAdminStoreHook()

    return (
        <>
            <ContentMobileLayout icon={<FaStore className='text-lg' />} title='Data Outlet'>
                <div className="w-full flex justify-between gap-1 items-center">
                    <div className="w-full flex gap-2 items-center">
                        <div className="flex w-full items-center justify-center">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    onChange={(e) => debounce(e.target.value)}
                                    value={searchItem}
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border z-0 text-sm border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                                />
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            </div>
                        </div>
                        <ButtonCustom onClick={() => router.push('/admin/outlet/c')} py='py-3' rounded="rounded-xl flex items-center" btnColor="bg-orange-500" width="w-fit"><FaPlus className="text-sm" /></ButtonCustom>
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
                                            value={sortStore} onChange={(e) => setSortStore(e.target.value)}
                                            id="searchWorker" className="w-full px-4 py-2 border h-fit rounded-lg border-gray-300 text-sm text-neutral-600">
                                            <option value="" disabled>-- Pilih Opsi --</option>
                                            <option value="name-asc">Produk A - Z</option>
                                            <option value="name-desc">Produk Z - A</option>
                                            <option value="latest-item">Data terbaru</option>
                                            <option value="oldest-item">Data terlama</option>
                                            <option value="">Reset</option>
                                        </select>
                                    </section>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                {isLoading && <Loading />}
                {isError && <p>Silahkan coba beberapa saat lagi.</p>}
                {!isLoading && getDataStore?.length > 0 ? (
                    getDataStore?.map((store: IStore, i: number) => {
                        const address = `${store?.address}, ${store?.city}, ${store?.province}`
                        return (
                            <div key={i} className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 p-1 bg-orange-400 rounded-lg">
                                        <Image
                                            src="https://img.freepik.com/premium-vector/shopping-store-building-icon-vector_620118-14.jpg?semt=ais_hybrid"
                                            alt="store"
                                            height={200}
                                            width={200}
                                            className="h-7 w-7 rounded-lg object-cover"
                                        />
                                    </div>
                                    <div className="ml-2">
                                        <h2 className="font-medium text-sm text-gray-900">{store?.storeName?.toUpperCase()}</h2>
                                        <p className="text-xs text-gray-500">{new Date(store?.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className='flex gap-2'>
                                    <ConfirmAlert disabled={isPendingDelete}
                                        caption={`Hapus "${store?.storeName?.toUpperCase()}"?`}
                                        description='Semua data yang berkaitan dengan outlet ini akan ikut terhapus.'
                                        onClick={() => {
                                            deleteStoreById(store?.id); // No return value
                                        }}
                                    >
                                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                    </ConfirmAlert>
                                    <Link href={`/admin/outlet/e/${store?.id}`} className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /> </Link>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    !isLoading && (
                        <NoData />
                    )
                )}
                {!isLoading && getDataStore?.length > 0 && (
                    <Pagination page={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
                )}
            </ContentMobileLayout>
            <ContentWebLayout caption='Data Outlet' >
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center">
                        <select name="searchWorker"
                            value={sortStore} onChange={(e) => setSortStore(e.target.value)}
                            id="searchWorker" className="px-4 py-2 border focus:outline-none focus:border-orange-500 rounded-2xl border-gray-300 text-sm text-neutral-600">
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

                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10">
                                        <Loading />
                                    </td>
                                </tr>
                            ) : (
                                !isLoading && getDataStore?.length > 0 ? (
                                    getDataStore?.map((store: IStore, i: number) => {
                                        const address = `${store?.address}, ${store?.city}, ${store?.province}`
                                        return (
                                            <tr className="hover:bg-gray-100 border-b" key={store?.id || i}>
                                                <td className="py-3 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                                <td className="py-3 px-6 text-sm text-gray-600 break-words">{store?.storeName?.toUpperCase()}</td>
                                                <td className="py-3 px-6 text-sm text-gray-600 break-words">{address?.length > 50 ? `${address?.slice(0, 50)}..` : address}</td>
                                                <td className="py-3 px-6 text-sm text-gray-600 break-words text-center">{new Date(store?.createdAt).toLocaleDateString()}</td>
                                                <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                    <div className='flex gap-2'>
                                                        <ConfirmAlert disabled={isPendingDelete}
                                                            caption={`Hapus "${store?.storeName?.toUpperCase()}"?`}
                                                            description='Semua data yang berkaitan dengan outlet ini akan ikut terhapus.'
                                                            onClick={() => deleteStoreById(store?.id)}>
                                                            <button disabled={isPendingDelete} className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                        </ConfirmAlert>
                                                        <Link href={`/admin/outlet/e/${store?.id}`} className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /> </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center font-bold">
                                            {isLoading ? <span className="py-10"><Loading /></span> : <NoData />}
                                        </td>
                                    </tr>
                                )
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