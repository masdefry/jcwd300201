'use client'

import { instance } from "@/utils/axiosInstance";
import authStore from "@/zustand/authstore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "@/components/hooks/use-toast";

const useProductLaundryHooks = () => {
    const token = authStore((state) => state?.token)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchItem, setSearchItem] = useState<string>(params.get('search') || '')
    const [sortProduct, setSortProduct] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()

    const { data: dataItem, isLoading, refetch } = useQuery({
        queryKey: ['get-data-item', searchItem],
        queryFn: async () => {
            const response = await instance.get('/laundry/laundry-items', {
                params: {
                    search: searchItem,
                    page: currentPage,
                    sort: sortProduct
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response?.data?.data
        }
    })

    const { mutate: createProductItem, isPending } = useMutation({
        mutationFn: async ({ itemName }: { itemName: string }) => {
            return await instance.post('/laundry', { itemName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            refetch()
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })

    const { mutate: handleDeleteItem, isPending: isPendingDelete } = useMutation({
        mutationFn: async (id: number) => {
            return await instance.patch(`/laundry/laundry-items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            refetch()
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })


    const { mutate: handleUpdateItem, isPending: isPendingUpdate } = useMutation({
        mutationFn: async ({ id, itemName }: { id: string, itemName: string }) => {
            return await instance.patch(`/laundry/laundry-items/${id}`, { itemName }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })

            refetch()
        },
        onError: (err: any) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })

    const getDataItem = dataItem?.findItem
    const totalPages = dataItem?.totalPage

    const handlePageChange = (page: any) => {
        setCurrentPage(page)
    }

    const debounce = useDebouncedCallback((value) => {
        setSearchItem(value)
    }, 1000)

    useEffect(() => {
        if (searchItem) {
            currentUrl.set('search', searchItem)
        } else {
            currentUrl.delete('search')
        }

        if (sortProduct) {
            currentUrl.set('sort', sortProduct)
        } else {
            currentUrl.delete('sort')
        }
        if (currentPage) {
            currentUrl.set('page', String(currentPage))
        } else {
            currentUrl.delete('page')
        }

        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        router.refresh()
        refetch()

    }, [params, refetch, pathname, currentPage, totalPages, entriesPerPage, sortProduct])

    return {
        currentPage, setCurrentPage,
        entriesPerPage, setEntriesPerPage,
        searchItem, setSearchItem,
        sortProduct, setSortProduct,
        dataItem, isLoading, refetch,
        createProductItem, isPending,
        handleDeleteItem, isPendingDelete,
        handleUpdateItem, isPendingUpdate,
        getDataItem, totalPages,
        handlePageChange, debounce
    }
}

export { useProductLaundryHooks }