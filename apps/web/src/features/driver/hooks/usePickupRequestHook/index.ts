'use client'

import { useQuery, useMutation } from "@tanstack/react-query"
import { instance } from "@/utils/axiosInstance"
import authStore from "@/zustand/authoStore"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useToast } from "@/components/hooks/use-toast"
import { useState, useEffect, ChangeEvent } from "react"


export const usePickupRequestHook = () => {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const { toast } = useToast()

    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const [page, setPage] = useState<number>(1)
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "all");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [isSearchValues, setIsSearchValues] = useState<string>('')

    const limit = 5;

    const { data: dataOrderAwaitingPickup, isFetching, refetch, isLoading: dataOrderAwaitingPickupLoading, isError: dataOrderAwaitingPickupError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const tabValue =
                activeTab === "waiting-pickup" ? "AWAITING_DRIVER_PICKUP" :
                    activeTab === "process-pickup" ? "DRIVER_TO_OUTLET" :
                        activeTab === "arrived" ? "DRIVER_ARRIVED_AT_OUTLET" : "";

            const res = await instance.get('/order/order', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: tabValue,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const { mutate: handleProcessOrder, isPending: handleProcessOrderPending } = useMutation({
        mutationFn: async (slug: string) => {
            return await instance.post(`/order/accept-order/${slug}`, { email }, {
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
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })
    const { mutate: handleProcessOrderOutlet, isPending: handleProcessOrderOutletPending } = useMutation({
        mutationFn: async (slug: string) => {
            return await instance.post(`/order/accept-outlet/${slug}`, { email }, {
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
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })


    const debounce = useDebouncedCallback(values => {
        setSearchInput(values)
        setPage(1)
    }, 500);

    const totalPages = dataOrderAwaitingPickup?.totalPage || 1

    useEffect(() => {
        const currentUrl = new URLSearchParams(params.toString());
        if (searchInput) {
            currentUrl.set(`search`, searchInput)
        } else {
            currentUrl.delete(`search`)
        }
        if (sortOption) {
            currentUrl.set("sort", sortOption);
        } else {
            currentUrl.delete(`sort`)
        }
        if (activeTab) {
            currentUrl.set("tab", activeTab);
        } else {
            currentUrl.delete(`tab`)
        }
        if (dateFrom) {
            currentUrl.set('date-from', dateFrom?.toString())
        } else {
            currentUrl.delete('date-from')
        }
        if (dateUntil) {
            currentUrl.set('date-until', dateUntil?.toString())
        } else {
            currentUrl.delete('date-until')
        }
        if (page) {
            currentUrl.set('page', page?.toString())
        } else {
            currentUrl.delete('page')
        }
        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [searchInput, router, pathname, params, activeTab, page, sortOption, refetch, dateFrom, dateUntil]);

    return {
        debounce,
        setIsSearchValues,
        isSearchValues,
        refetch,
        page,
        setPage,
        searchInput,
        setSearchInput,
        entriesPerPage,
        setEntriesPerPage,
        sortOption,
        setSortOption,
        activeTab,
        setActiveTab,
        dateFrom,
        setDateFrom,
        dateUntil,
        setDateUntil,
        dataOrderAwaitingPickup,
        isFetching,
        dataOrderAwaitingPickupLoading,
        dataOrderAwaitingPickupError,
        handleProcessOrder,
        handleProcessOrderPending,
        handleProcessOrderOutlet,
        handleProcessOrderOutletPending,
        totalPages,
    };
}