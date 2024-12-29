'use client'

import { useQuery } from "@tanstack/react-query";
import { instance } from "@/utils/axiosInstance";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useWorkerHooks = () => {
    const params = useSearchParams()
    const currentParams = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchWorker, setSearchWorker] = useState<string>(params.get('search') || '')
    const [sortWorker, setSortWorker] = useState<string>(params.get('sort') || '')
    const router = useRouter()
    const pathname = usePathname()

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

    const dataWorker = getDataWorker?.findWorker
    const totalPages = getDataWorker?.totalPages


    const handlePageChange = (page: any) => setCurrentPage(page)
    const debounce = useDebouncedCallback((value) => {
        setSearchWorker(value)
    }, 1000)

    useEffect(() => {
        if (searchWorker) {
            currentParams.set('search', searchWorker)
        } else {
            currentParams.delete('search')
        }

        if (sortWorker) {
            currentParams.set('sort', sortWorker)
        } else {
            currentParams.delete('sort')
        }

        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${currentParams.toString()}`)
        router.refresh()
        refetch()

    }, [params, searchWorker, sortWorker, refetch, pathname, currentPage, totalPages, entriesPerPage])

    return {
        currentPage, setCurrentPage,
        entriesPerPage, setEntriesPerPage,
        searchWorker, setSearchWorker,
        sortWorker, setSortWorker,
        getDataWorker, refetch, isFetching,
        dataWorker, totalPages,
        handlePageChange, debounce, isLoading
    }
}

export { useWorkerHooks }