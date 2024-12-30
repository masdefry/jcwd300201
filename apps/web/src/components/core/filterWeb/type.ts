export interface IFilterPropsWeb {
    debounce: (value: string) => void;
    sortOption: string;
    setSortOption: (value: string) => void;
    dateFrom: string | null;
    dateUntil: string | null;
    setDateFrom: (value: string | null) => void;
    setDateUntil: (value: string | null) => void;
    setActiveTab: (tab: string) => void;
    setSearchInput: (input: string) => void;
    activeTab: string;
    outletId?: string | null;
    setOutletId?: (id: string) => void;
    getDataStore?: Array<{ storeId: string, storeName: string }>;
    isStoreLoading?: boolean;
    isStoreError?: boolean;
    setPage: (page: number) => void;
    showStoreSelect?: boolean;
    options?: { value: string, label: string }[];
    showTabOption?: boolean;
    searchInput: string;
    borderReset?: string
    isSearchValues: string
    setIsSearchValues: (input: string) => void;
}