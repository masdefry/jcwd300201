import { useState, useEffect } from "react"
import authStore from "@/zustand/authoStore"
import { instance } from "@/utils/axiosInstance"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useDebouncedCallback } from "use-debounce"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/hooks/use-toast"


export const useAdminOutletOrderHook = () => {
    const params = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast()
    const token = authStore((state) => state?.token);
    const email = authStore((state) => state?.email);

    const [page, setPage] = useState(Number(params.get("page")) || 1);
    const [entriesPerPage, setEntriesPerPage] = useState<number>(5)
    const [isSearchValues, setIsSearchValues] = useState<string>('')
    const [searchInput, setSearchInput] = useState(params.get("search") || "");
    const [sortOption, setSortOption] = useState(params.get("sort") || "date-asc");
    const [activeTab, setActiveTab] = useState(params.get("tab") || "proses");
    const [dateFrom, setDateFrom] = useState(params.get('date-from') || null);
    const [dateUntil, setDateUntil] = useState(params.get('date-until') || null);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [outletId, setOutletId] = useState<any>(null);

    const limit = 5;

    const { data: dataOrderList, refetch, isLoading: dataOrderListLoading, isError: dataOrderListError } = useQuery({
        queryKey: ['get-order', page, searchInput, page, searchInput, dateFrom, dateUntil, sortOption, activeTab],
        queryFn: async () => {
            const res = await instance.get(`/order/orders/`, {
                params: {
                    page,
                    limit_data: limit,
                    search: searchInput || "",
                    sort: sortOption,
                    tab: activeTab,
                    dateFrom,
                    dateUntil,
                    outletId
                },
                headers: { Authorization: `Bearer ${token}` }
            });
            return res?.data?.data;
        },
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);

    const { mutate: handleOrderDetail } = useMutation({
        mutationFn: async (id: string | number) => {
            const res = await instance.get(`/order/orders-detail/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return setOrderData(res?.data?.data);
        },
    })

    const { data: getDataStore, isFetching, isLoading: isStoreLoading, isError: isStoreError } = useQuery({
        queryKey: ['get-data-store'],
        queryFn: async () => {
            const res = await instance.get('/store')
            return res?.data?.data
        }
    })

    const getDataItem = dataOrderList?.dataOrder

    const handlePageChange = (page: any) => {
        setPage(page)
    }


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
            currentUrl.set(`date-from`, dateFrom?.toString())
        } else {
            currentUrl.delete(`date-from`)
        }
        if (dateUntil) {
            currentUrl.set(`date-until`, dateUntil?.toString())
        } else {
            currentUrl.delete(`date-until`)
        }
        if (page) {
            currentUrl.set(`page`, page?.toString())
        } else {
            currentUrl.delete(`page`)
        }

        router.push(`${pathname}?${currentUrl.toString()}`)
        refetch()
    }, [params, pathname, router, searchInput, page, sortOption, activeTab, refetch, dateFrom, dateUntil]);


    const totalPages = dataOrderList?.totalPage || 1;

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
        refetch,
        debounce, totalPages, isFetching, limit,
        handleOrderDetail,
        getDataStore,
        isStoreLoading,
        isStoreError,
        openDialog, setOpenDialog,
        orderData, dataOrderListLoading, dataOrderListError, dataOrderList,
        setOrderData, handlePageChange, entriesPerPage, outletId, setOutletId
    }
}