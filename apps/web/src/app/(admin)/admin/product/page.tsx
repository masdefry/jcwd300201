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

export default function Page() {
    const { currentPage, entriesPerPage, sortProduct, setSortProduct, isFetching, createProductItem,
        isPending, handleDeleteItem, isPendingDelete, handleUpdateItem, isPendingUpdate,
        getDataItem, totalPages, handlePageChange, debounce } = useProductLaundryHooks()

    return (
        <>

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
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
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
                                    <td colSpan={6} className="text-center py-20 font-bold">{isFetching ? 'Mohon tunggu...' : 'Data tidak tersedia'}</td>
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