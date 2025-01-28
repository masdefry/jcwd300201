'use client'

import ButtonCustom from "@/components/core/buttonCustom";
import SearchInputCustom from "@/components/core/searchBarCustom";
import { ChangeEvent } from "react";
import { useProductLaundryHook } from "@/features/superAdmin/hooks/useProductLaundryHook";
import DialogCreateProduct from "@/features/superAdmin/components/dialogCreateProductLaundry";
import ContentWebLayout from "@/components/core/webSessionContent";
import PaginationWebLayout from "@/components/core/paginationWebLayout";
import { FaSearch } from "react-icons/fa";
import Loading from "@/components/core/loadingCustom";
import NoData from "@/components/core/noDataCustom";
import { FaCartArrowDown, FaEllipsisVertical, FaPlus } from "react-icons/fa6";
import Pagination from "@/components/core/paginationCustom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { createProductLaundryValidationSchema } from "@/features/superAdmin/schemas/createProductLaundryValidationSchema";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import ProductMobile from "@/features/superAdmin/components/productMobileComponent";
import ProductWeb from "@/features/superAdmin/components/productWebComponent";
import { IProduct } from "./type";

export default function Page() {
    const { currentPage, entriesPerPage, sortProduct, setSortProduct, isLoading, createProductItem,
        isPending, handleDeleteItem, isPendingDelete, handleUpdateItem, isPendingUpdate,
        getDataItem, totalPages, isValueSearch, setIsValueSearch, handlePageChange, debounce, searchItem, setCurrentPage } = useProductLaundryHook()

    return (
        <>
            <ContentMobileLayout icon={<FaCartArrowDown className="text-lg" />} title='Produk'>
                <div className="w-full flex justify-between gap-1 items-center">
                    <div className="w-full flex gap-2 items-center">
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
                        <Dialog>
                            <DialogTrigger asChild>
                                <ButtonCustom py='py-3' rounded="rounded-xl flex items-center" btnColor="bg-orange-500" width="w-fit"><FaPlus className="text-sm" /></ButtonCustom>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Buat item baru</DialogTitle>
                                    <DialogDescription>
                                        Harap masukan nama produk atau item yang ingin ditambahkan.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="w-full">
                                    <Formik
                                        initialValues={{ itemName: '' }}
                                        validationSchema={createProductLaundryValidationSchema}
                                        onSubmit={(values, { resetForm }) => createProductItem({ itemName: values?.itemName }, {
                                            onSuccess: () => {
                                                resetForm()
                                            }
                                        })}>
                                        <Form className="w-full">
                                            <div className="space-y-2 flex flex-col relative">
                                                <label htmlFor="itemName" className="font-semibold">Nama Produk <span className="text-red-500">*</span></label>
                                                <Field name='itemName' placeholder="Masukan Nama Item.."
                                                    className='border focus:outline-none py-2 px-4' />
                                                <ErrorMessage component='div' className="text-red top-0 right-0 absolute text-xs text-red-500" name="itemName" />
                                            </div>
                                            <div className="py-2 w-full flex justify-end">
                                                <ButtonCustom disabled={isPending} type="submit" rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500 text-sm">Tambah</ButtonCustom>
                                            </div>
                                        </Form>
                                    </Formik>
                                </div>
                            </DialogContent>
                        </Dialog>
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
                                            value={sortProduct} onChange={(e) => setSortProduct(e.target.value)}
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
                {getDataItem?.length > 0 ? (
                    getDataItem?.map((prod: IProduct, i: number) => {
                        return (
                            <ProductMobile
                                key={prod?.id} i={i} isPendingDelete={isPendingDelete} handleUpdateItem={handleUpdateItem} prod={prod} handleDeleteItem={handleDeleteItem} isPendingUpdate={isPendingUpdate}
                            />
                        )
                    }))
                    : (
                        <div>
                            <div className="text-center py-20 font-bold">{isLoading ? <Loading /> : <NoData />}</div>
                        </div>
                    )}
                {!isLoading && getDataItem?.length > 0 && (
                    <Pagination page={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
                )}
            </ContentMobileLayout>
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
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setIsValueSearch(e.target.value)
                            debounce(e.target.value)
                        }} />
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
                                getDataItem?.map((prod: IProduct, i: number) => {
                                    return (
                                        <ProductWeb key={prod?.id} currentPage={currentPage} entriesPerPage={entriesPerPage} i={i} isPendingDelete={isPendingDelete} handleUpdateItem={handleUpdateItem} prod={prod} handleDeleteItem={handleDeleteItem} isPendingUpdate={isPendingUpdate} />
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