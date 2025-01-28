'use client'

import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/components/hooks/use-toast";
import authStore from "@/zustand/authoStore";

const useWorkerHook = () => {
    const params = useSearchParams()
    const currentParams = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchWorker, setSearchWorker] = useState<string>(params.get('search') || '')
    const [sortWorker, setSortWorker] = useState<string>(params.get('sort') || '')
    const [isValueSearch, setIsValueSearch] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()
    const token = authStore((state) => state?.token)
    const email = authStore((state) => state?.email)

    const { data: getDataWorker, refetch, isFetching, isLoading } = useQuery({
        queryKey: ['get-data-worker', searchWorker, sortWorker],
        queryFn: async () => {
            const response = await instance.get('/worker/all-workers', {
                params: {
                    search: searchWorker,
                    sort: sortWorker,
                    page: currentPage,
                    limit: entriesPerPage
                }
            })

            return response?.data?.data
        }
    })

    const { mutate: handleDeleteData, isPending: isPendingDelete } = useMutation({
        mutationFn: async (idUser: any) => {
            return await instance.patch(`/worker/detail/${idUser}`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res: { data: { message: string } }) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
            refetch()
            router.push('/admin/worker')

        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg border-none"
            })
        }
    })

    const dataWorker = getDataWorker?.findWorker
    const totalPages = getDataWorker?.totalPages


    const handlePageChange = (page: any) => setCurrentPage(page)
    const debounce = useDebouncedCallback((value) => {
        setSearchWorker(value)
    }, 1000)

    useEffect(() => {
        const isUrl = new URLSearchParams(params.toString())

        if (searchWorker) {
            isUrl.set('search', searchWorker)
        } else {
            isUrl.delete('search')
        }

        if (sortWorker) {
            isUrl.set('sort', sortWorker)
        } else {
            isUrl.delete('sort')
        }

        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${isUrl.toString()}`)
        router.refresh()
        refetch()

    }, [params, router, searchWorker, sortWorker, refetch, pathname, currentPage, totalPages, entriesPerPage])

    return {
        currentPage, setCurrentPage,
        entriesPerPage, setEntriesPerPage,
        searchWorker, setSearchWorker,
        sortWorker, setSortWorker,
        getDataWorker, refetch, isFetching,
        dataWorker, totalPages,
        handlePageChange, debounce, isLoading,
        isValueSearch, setIsValueSearch,
        router, handleDeleteData, isPendingDelete
    }
}

export { useWorkerHook }