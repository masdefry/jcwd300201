'use client'

import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "@/components/hooks/use-toast";
import { FaStore, FaUser } from "react-icons/fa6";


const useUserAddressHook = () => {
    const token = authStore((state) => state?.token)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchItem, setSearchItem] = useState<string>(params.get('search') || '')
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
        mutationFn: async (id: string | number) => {
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
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    const { mutate: handleChangeMainAddress, isPending: isPendingChangeAddress } = useMutation({
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
            refetch()
        },
        onError: (err: { response: { data: { message: string } } }) => {
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

    const settingsItems = [
        { name: 'nama alamat', description: 'jl.rorojonggrang', icon: FaUser },
        { name: 'nama alamat', description: 'alamat outlet', icon: FaStore },
        { name: 'nama alamat', description: 'alamat outlet', icon: FaStore },
    ];

    return {
        token, currentUrl, params, currentPage, setCurrentPage, entriesPerPage, setEntriesPerPage,
        searchItem, setSearchItem, debounce, getDataItem, isFetching, refetch, isPending,
        handleDeleteItem, isPendingDelete, handleChangeMainAddress, isPendingChangeAddress,
        router, pathname, settingsItems
    }
}

export { useUserAddressHook }