'use client'

import ButtonCustom from "@/components/core/buttonCustom";
import { FaSearch } from 'react-icons/fa';
import Image from "next/image";
import Link from "next/link";
import ContentWebLayout from "@/components/core/webSessionContent";
import SearchInputCustom from "@/components/core/searchBarCustom";
import { ChangeEvent } from "react";
import { FaAddressCard, FaPlus } from "react-icons/fa6";
import { useUserAddressHook } from "@/features/user/hooks/useUserAddressHook";
import SkeletonLoadingComponent from "@/features/user/components/skeletonLoadingComponents";
import PaginationWebLayout from "@/components/core/paginationWebLayout";
import TableAddressUser from "@/features/user/components/tableAddressUser";
import TableHeadUserAddress from "@/features/user/components/tableHeadUserAddress";
import ContentMobileLayout from "@/components/core/mobileSessionLayout/mainMenuLayout";
import { ConfirmAlert } from "@/components/core/confirmAlertCustom";
import { BsPencil, BsTrash } from "react-icons/bs";
import NoData from "@/components/core/noDataCustom";
import { IUserAddress } from "./type";
import Loading from "@/components/core/loadingCustom";

export default function Page() {
    const { currentPage, entriesPerPage, debounce, getDataItem, isFetching, isPending, handleDeleteItem,
        isPendingDelete, handleChangeMainAddress, isValueSearch, setIsValueSearch, isLoading,setSearchItem, router, settingsItems } = useUserAddressHook()

    if (isFetching) return (
        <SkeletonLoadingComponent />
    )

    return (
        <>
            <ContentMobileLayout title="Alamat Saya" icon={<FaAddressCard className="text-lg" />}>
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
                    <ButtonCustom onClick={() => router.push('/user/dashboard/settings/address/c')} py='py-3' rounded="rounded-xl flex items-center" btnColor="bg-orange-500" width="w-fit"><FaPlus className="text-sm" /></ButtonCustom>
                </div>
                {isLoading && <Loading />}
                {!isLoading && getDataItem?.length > 0 ? (
                    getDataItem?.map((address: IUserAddress, i: number) => {
                        return (
                            <div key={i} className='flex w-full justify-between items-center h-fit'>
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
                                        <h2 className="font-medium text-sm text-gray-900">{address?.addressDetail}, {address?.city}</h2>
                                        <p className="text-xs text-gray-500">{address?.province}, {address?.country}, {address?.zipCode}</p>
                                    </div>
                                </div>
                                <div className='flex gap-2'>
                                    <ConfirmAlert disabled={isPendingDelete} caption="Apakah anda yakin ingin menghapus alamat anda?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => handleDeleteItem(address?.id)}>
                                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /></button>
                                    </ConfirmAlert>
                                    <Link href={`/user/dashboard/settings/address/e/${address?.id}CNC${Date.now()}`} className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /></Link>
                                </div>
                            </div>
                        )
                    })
                ) : <NoData />}
            </ContentMobileLayout>

            <ContentWebLayout caption="Alamat Saya">
                <div className="w-full h-fit flex">
                    <div className="w-1/2 h-fit flex items-center"></div>
                    <div className="w-1/2 h-fit flex gap-2 justify-end">
                        <SearchInputCustom onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setIsValueSearch(e.target.value)
                            debounce(e.target.value)
                        }} value={isValueSearch || ''}/>
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
                                getDataItem?.map((address: IUserAddress, i: number) => {
                                    return (
                                        <TableAddressUser key={i} onChangeMainAddress={() => handleChangeMainAddress(address?.id)} onDeleteAddress={() => handleDeleteItem(address?.id)}
                                            address={address} currentPage={currentPage} entriesPerPage={entriesPerPage} i={i} isPendingDelete={isPendingDelete} />
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-5 font-bold text-center text-lg text-gray-600 break-words"><NoData /></td>
                                </tr>
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