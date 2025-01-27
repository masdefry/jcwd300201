'use client'
import { useState, useEffect } from "react"
import authStore from "@/zustand/authStore"
import { instance } from "@/utils/axiosInstance"
import { useQuery } from "@tanstack/react-query"
import { useDebouncedCallback } from "use-debounce"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

export const useDriverHistoryHook = () => {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const token = authStore((state) => state?.token);
    const [isSearchValues, setIsSearchValues] = useState<string>('')

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "pickup");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const limit = 5;

    const { data: dataHistoryOrder, refetch, isLoading: dataHistoryOrderLoading, isError: dataHistoryOrderError, isFetching } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {

            const res = await instance.get('/order/history-driver', {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    dateFrom: dateFrom ?? '',
                    dateUntil: dateUntil ?? '',
                    tab: activeTab,
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });

    const debounce = useDebouncedCallback(values => {
        setSearchInput(values)
        setPage(1)
    }, 500);

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
    }, [searchInput, router, pathname, params, page, activeTab, sortOption, refetch, dateFrom, dateUntil]);


    const totalPages = dataHistoryOrder?.totalPage || 1;

    return {
        params,
        router,
        pathname,
        token,
        isSearchValues,
        setIsSearchValues,
        page,
        setPage,
        searchInput, setSearchInput,
        sortOption, setSortOption,
        activeTab, setActiveTab,
        dateFrom, setDateFrom,
        dateUntil, setDateUntil,
        dataHistoryOrder, refetch, dataHistoryOrderLoading,
        debounce, totalPages, dataHistoryOrderError, isFetching, limit
    }
}