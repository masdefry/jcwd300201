'use client'

import ButtonCustom from "@/components/core/button";
import { FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link";
import HeaderMobileUser from "@/components/core/headerMobileUser";
import ContentWebLayout from "@/components/core/webSessionContent";
import SearchInputCustom from "@/components/core/searchBar";
import { ChangeEvent } from "react";
import { FaPlus } from "react-icons/fa6";
import TableNotFoundComponent from "@/features/user/components/tableNotFound";
import { useUserAddressHooks } from "@/features/user/hooks/useUserAddressHooks";
import SkeletonLoadingComponent from "@/features/user/components/skeletonLoadingComponents";
import PaginationWebLayout from "@/components/core/paginationWebLayout";
import TableAddressUser from "@/features/user/components/tableAddressUser";
import TableHeadUserAddress from "@/features/user/components/tableHeadUserAddress";

export default function Page() {
    const { currentPage, entriesPerPage, debounce, getDataItem, isFetching, isPending, handleDeleteItem,
        isPendingDelete, handleChangeMainAddress, router, settingsItems } = useUserAddressHooks()

    if (isFetching) return (
        <SkeletonLoadingComponent />
    )

    return (
        <>
            <HeaderMobileUser />
            <main className="mx-8 md:hidden block">
                <section className="flex justify-between bg-white w-full pr-14 font-bold fixed pt-16 text-lg border-b-2 pb-4">
                    <div className="flex items-center gap-2"> <Link href='/users/settings'><FaArrowLeft /></Link> Alamat</div>
                    <div> <ButtonCustom btnColor="bg-orange-500">+ Tambah Alamat</ButtonCustom> </div>
                </section>
                <div className="py-32 space-y-4">
                    {settingsItems.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between bg-white py-4 px-2 rounded-lg shadow-sm transition-all duration-200 hover:bg-gray-100"
                        >
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-1 bg-orange-400 rounded-lg">
                                    <Image
                                        src="https://img.freepik.com/premium-vector/shopping-store-building-icon-vector_620118-14.jpg?semt=ais_hybrid"
                                        alt="store"
                                        height={200}
                                        width={200}
                                        className="h-10 w-10 rounded-lg object-cover"
                                    />
                                </div>
                                <div className="ml-2">
                                    <h2 className="font-medium text-gray-900">{item.name}</h2>
                                    <p className="text-xs text-gray-500">{item.description}</p>
                                    <p className="text-xs text-gray-500">+62 8464654653515</p>
                                </div>
                            </div>

                            <div className="flex space-x-1">
                                <button className="flex items-center space-x-2 px-2 py-0 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg">
                                    <FaEdit />
                                </button>
                                <button className="flex items-center space-x-2 px-0 py-0 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
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
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <ContentWebLayout caption="Alamat Saya">
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center"></div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom placeholder='Cari alamat..' onChange={(e: ChangeEvent<HTMLInputElement>) => debounce(e.target.value)} />
                        <ButtonCustom onClick={() => router.push('/user/dashboard/settings/address/c')} rounded="rounded-2xl flex gap-2 items-center" btnColor="bg-orange-500"><FaPlus /> Tambah alamat</ButtonCustom>
                    </div>
                </div>

                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <TableHeadUserAddress />
                        </thead>
                        <tbody>
                            {getDataItem?.length > 0 ? (
                                getDataItem?.map((address: any, i: number) => {
                                    return (
                                        <TableAddressUser key={i} onChangeMainAddress={() => handleChangeMainAddress(address?.id)} onDeleteAddress={() => handleDeleteItem(address?.id)}
                                            address={address} currentPage={currentPage} entriesPerPage={entriesPerPage} i={i} isPendingDelete={isPendingDelete} />
                                    )
                                })
                            ) : (
                                <TableNotFoundComponent isFetching={isFetching} />
                            )}
                        </tbody>
                    </table>
                    <PaginationWebLayout totalPages={1} currentPage={currentPage}>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled>Sebelumnya</ButtonCustom>
                        <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled>Selanjutnya</ButtonCustom>
                    </PaginationWebLayout>
                </div>
            </ContentWebLayout>
        </>
    );

}