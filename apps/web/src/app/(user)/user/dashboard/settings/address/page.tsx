'use client'

import ButtonCustom from "@/components/core/button";
import { FaUser, FaStore, FaEdit, FaTrashAlt, FaArrowLeft } from 'react-icons/fa';
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import Link from "next/link";
import HeaderMobileUser from "@/components/core/headerMobileUser";
import ContentWebLayout from "@/components/core/webSessionContent";
import SearchInputCustom from "@/components/core/searchBar";
import { ConfirmAlert } from "@/components/core/confirmAlert";
import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { BsPencil, BsTrash } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { useDebouncedCallback } from "use-debounce";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup'
import { toast } from "@/components/hooks/use-toast";



export default function Page() {
    const token = authStore((state) => state?.token)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchItem, setSearchItem] = useState<string>(params.get('search') || '')
    const [sortProduct, setSortProduct] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()

    const { data: getDataItem, isFetching, refetch, isPending } = useQuery({
        queryKey: ['get-data-item', searchItem],
        queryFn: async () => {
            const response = await instance.get('/user/all-address', {
                params: {
                    search: searchItem
                }, headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response?.data?.data
        }
    })

    const debounce = useDebouncedCallback((value) => {
        setSearchItem(value)
    }, 1000)

    const { mutate: handleDeleteItem, isPending: isPendingDelete } = useMutation({
        mutationFn: async (id) => {
            return await instance.delete(`/user/address/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            refetch()
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })

            console.log(res)
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
            console.log(err)
        }
    })

    const { mutate: handleChangeMainAddress } = useMutation({
        mutationFn: async (id: number) => {
            return await instance.patch(`/user/main-address/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })
            console.log(res)
            refetch()
        },
        onError: (err: any) => {
            console.log(err)
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    useEffect(() => {
        if (searchItem) {
            currentUrl.set('search', searchItem)
        } else {
            currentUrl.delete('search')
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        router.refresh()
        refetch()

    }, [params, pathname, refetch, searchItem])

    if (isPending) return (
        <main className="w-full h-full bg-neutral-200 p-4 gap-2 hidden md:flex">
            <section className="w-full flex flex-col p-4 rounded-xl h-full bg-white">
                <div className="flex flex-col w-full gap-5 h-full">
                    <div className="w-full py-7 bg-neutral-300 animate-pulse px-14 rounded-xl">
                        <h1 className="font-bold text-white"></h1>
                    </div>
                    <div className='w-full flex gap-2'>
                        <div className='py-7 bg-neutral-300 animate-pulse px-14 rounded-xl'></div>
                        <div className='py-7 bg-neutral-300 animate-pulse px-14 rounded-xl'></div>
                        <div className='py-7 bg-neutral-300 animate-pulse px-14 rounded-xl'></div>
                    </div>
                    <div className='w-full h-full bg-neutral-300 animate-pulse rounded-xl'></div>
                </div>
            </section>
        </main>
    )

    const settingsItems = [
        { name: 'nama alamat', description: 'jl.rorojonggrang', icon: FaUser },
        { name: 'nama alamat', description: 'alamat outlet', icon: FaStore },
        { name: 'nama alamat', description: 'alamat outlet', icon: FaStore },
    ];


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

                {/* table */}
                <div className="w-full flex flex-col justify-center">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">NO</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Alamat</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Utama</th>
                                <th className="py-3 px-6 text-left text-sm font-bold text-gray-600 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getDataItem?.length > 0 ? (
                                getDataItem?.map((address: any, i: number) => {
                                    return (
                                        <tr className="hover:bg-gray-100 border-b" key={address?.id || i}>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{(currentPage - 1) * entriesPerPage + i + 1}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">{address?.addressDetail}, {address?.city}, {address?.province}, {address?.country}, {address?.zipCode}</td>
                                            <td className="py-3 px-6 text-sm text-gray-600 break-words">
                                                <ConfirmAlert caption='Apakah yakin anda ingin mengganti alamat utama?' onClick={() => handleChangeMainAddress(address?.id)}
                                                    description='Halaman utama akan diganti sesuai yang anda pilih'>
                                                    <button>{address?.isMain ? 'Utama' : 'Lainnya'}</button>
                                                </ConfirmAlert>
                                            </td>
                                            <td className="py-3 px-6 text-sm text-blue-700 hover:text-blue-500 hover:underline break-words">
                                                <div className='flex gap-2'>
                                                    <ConfirmAlert disabled={isPendingDelete} caption="Apakah anda yakin ingin menghapus alamat anda?" description="Data akan dihapus secara permanen, harap berhati-hati." onClick={() => handleDeleteItem(address?.id)}>
                                                        <button className="py-2 hover:bg-red-500 px-2 bg-red-600 rounded-xl"><BsTrash className="text-white" /> </button>
                                                    </ConfirmAlert>
                                                    <Link href={`/user/dashboard/settings/address/e/${address?.id}CNC${Date.now()}`} className="py-2 hover:bg-blue-500 px-2 bg-blue-600 rounded-xl"><BsPencil className="text-white" /></Link>
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
                    <div className='flex gap-2 justify-between py-2 px-2 items-center'>
                        <div className="w-1/2 flex">
                            <h1 className="text-neutral-400">Page {currentPage} of 1</h1>
                        </div>
                        <div className="flex gap-2">
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled>Sebelumnya</ButtonCustom>
                            <ButtonCustom rounded="rounded-2xl" btnColor="bg-orange-500" disabled>Selanjutnya</ButtonCustom>
                        </div>
                    </div>
                </div>
            </ContentWebLayout>
        </>
    );

}