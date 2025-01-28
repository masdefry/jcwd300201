import { useState, useEffect } from "react"
import authStore from "@/zustand/authoStore"
import { instance } from "@/utils/axiosInstance"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useDebouncedCallback } from "use-debounce"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/hooks/use-toast";


export const useAdminStoreHook = () => {
    const token = authStore((state) => state?.token)
    const email = authStore((state) => state?.email)
    const params = useSearchParams()
    const currentUrl = new URLSearchParams(params)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [searchItem, setSearchItem] = useState<string>(params.get('search') || '')
    const [sortStore, setSortStore] = useState<string>('')
    const router = useRouter()
    const pathname = usePathname()

    const { data: dataItem, isFetching, isLoading, isError, refetch } = useQuery({
        queryKey: ['get-data-outlet', searchItem, sortStore],
        queryFn: async () => {
            const response = await instance.get('/store/stores', {
                params: {
                    search: searchItem,
                    page: currentPage,
                    sort: sortStore
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return response?.data?.data
        }
    })

    const { mutate: deleteStoreById, isPending: isPendingDelete } = useMutation({
        mutationFn: async (id: string | number) => {
            return await instance.patch(`/store/delete/${id}`, { email }, {
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


    const getDataStore = dataItem?.findStore
    const totalPages = dataItem?.totalPage

    const handlePageChange = (page: any) => {
        setCurrentPage(page)
    }

    const debounce = useDebouncedCallback((value) => {
        setSearchItem(value)
    }, 1000)

    useEffect(() => {
        const isUrl = new URLSearchParams(params?.toString())

        if (searchItem) {
            isUrl.set('search', searchItem)
        } else {
            isUrl.delete('search')
        }

        if (sortStore) {
            isUrl.set('sort', sortStore)
        } else {
            isUrl.delete('sort')
        }
        if (currentPage) {
            isUrl.set('page', String(currentPage))
        } else {
            isUrl.delete('page')
        }
        if (totalPages === undefined || currentPage > totalPages) {
            setCurrentPage(1)
        }

        router.push(`${pathname}?${isUrl.toString()}`)
        router.refresh()
        refetch()

    }, [params, refetch, pathname, currentPage, totalPages, entriesPerPage, sortStore, router, searchItem])

    return {
        isLoading,
        isPendingDelete,
        deleteStoreById,
        params,
        router,
        pathname,
        token,
        refetch,
        debounce, totalPages, isFetching,
        getDataStore,
        handlePageChange, entriesPerPage,
        searchItem, sortStore, currentPage,
        setSortStore, setCurrentPage, isError
    }
}