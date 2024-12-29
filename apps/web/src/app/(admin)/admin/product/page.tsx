'use client'

import ButtonCustom from "@/components/core/button";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import SearchInputCustom from "@/components/core/searchBar";
import { ChangeEvent } from "react";
import { useProductLaundryHooks } from "@/features/superAdmin/hooks/useProductLaundryHooks";
import DialogCreateProduct from "@/features/superAdmin/components/dialogCreateProductLaundry";
import DialogUpdateProduct from "@/features/superAdmin/components/dialogUpdateProductLaundry";
import ContentWebLayout from "@/components/core/webSessionContent";
import { BsTrash } from "react-icons/bs";
import PaginationWebLayout from "@/components/core/paginationWebLayout";
import HeaderMobile from "@/components/core/headerMobile";
import { FaEdit, FaSearch } from "react-icons/fa";
import Link from "next/link";
import Loading from "@/components/core/loading";
import NoData from "@/components/core/noData";
import { FaArrowLeft } from "react-icons/fa6";
import Pagination from "@/components/core/pagination";

export default function Page() {
    const { currentPage, entriesPerPage, sortProduct, setSortProduct, isLoading, createProductItem,
        isPending, handleDeleteItem, isPendingDelete, handleUpdateItem, isPendingUpdate,
        getDataItem, totalPages, handlePageChange, debounce, searchItem, setCurrentPage } = useProductLaundryHooks()

    return (
        <>
            <HeaderMobile />

            <main className="mx-8 md:hidden block">
                <section className="flex justify-between bg-white w-full pr-14 font-bold fixed pt-16 text-lg border-b-2 pb-4">
                    <div className="flex items-center gap-2"> <Link href='/admin/settings'><FaArrowLeft /></Link> PRODUCT</div>
                    <div> <ButtonCustom btnColor="bg-blue-500">+ Tambah Produk</ButtonCustom> </div>
                </section>
                <div className="py-32 space-y-4">
                    <div className="w-full flex justify-between gap-1 items-center">
                        <div className="w-1/2 flex justify-between gap-1 items-center">
                            <div className="flex items-center justify-center">
                                <div className="relative w-full max-w-md">
                                    <input
                                        type="text"
                                        onChange={(e) => debounce(e.target.value)}
                                        value={searchItem}
                                        placeholder="Search..."
                                        className="w-full pl-10 pr-4 py-2 border z-0 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <select name="searchWorker"
                            value={sortProduct} onChange={(e) => setSortProduct(e.target.value)}
                            id="searchWorker" className="w-1/2 px-4 py-2 border h-10 rounded-lg border-gray-300 text-sm text-neutral-600">
                            <option value="" disabled>-- Pilih Opsi --</option>
                            <option value="name-asc">Produk A - Z</option>
                            <option value="name-desc">Produk Z - A</option>
                            <option value="latest-item">Data terbaru</option>
                            <option value="oldest-item">Data terlama</option>
                            <option value="">Reset</option>
                        </select>
                    </div>

                    {getDataItem?.length > 0 ? (
                        getDataItem?.map((prod: any, i: number) => {
                            return (< div
                                key={i}
                                className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                            >
                                <div className="flex items-center">
                                    <div className="ml-2">
                                        <h2 className="font-medium text-gray-900">{prod?.itemName}</h2>
                                        <p className="text-xs text-gray-500">{new Date(prod?.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-1">
                                    <button className="flex items-center justify-center space-x-2 px-2 py-2 w-12 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                        <FaEdit />
                                    </button>
                                    <button className="flex items-center space-x-2 px-2 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                                        <ConfirmAlert
                                            caption={`Hapus "${prod?.itemName?.toUpperCase()}"?`}
                                            description='Semua data yang berkaitan dengan outlet ini akan ikut terhapus.'
                                            onClick={() => { console.log('delete') }}
                                        >

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
                    {!isLoading && getDataItem?.length > 0 && (
                        <Pagination page={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
                    )}
                </div>
            </main>
            {/* web */}
            <ContentWebLayout caption="Produk Laundry">
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
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} value={searchItem} />
                        <DialogCreateProduct createProductItem={createProductItem} isPending={isPending} />
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Nama</th>
                                <th className="py-3 px-6 text-sm font-bold text-gray-600 uppercase text-center">Tanggal dibuat</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getDataItem?.length > 0 ? (
                                getDataItem?.map((prod: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={prod?.id || i}>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{prod?.itemName}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words text-center">{new Date(prod?.createdAt).toLocaleDateString()}</td>
                                            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div className='flex gap-2'>
                                                    <ConfirmAlert disabled={isPendingDelete} caption="Apakah anda yakin ingin menghapus data ini?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => handleDeleteItem(prod?.id)}>
                                                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                    </ConfirmAlert>
                                                    <DialogUpdateProduct handleUpdateItem={handleUpdateItem} product={prod} isPendingUpdate={isPendingUpdate} />
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
                    <PaginationWebLayout currentPage={currentPage} totalPages={totalPages}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={currentPage == 1} onClick={() => handlePageChange(currentPage - 1)}>
                            Sebelumnya
                        </ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled={currentPage == totalPages || currentPage > totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                            Selanjutnya
                        </ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    );
}