export interface IFilterProps {
    debounce: (value: string) => void;
    sortOption: string;
    setSortOption: (value: string) => void;
    dateFrom: string | null;
    dateUntil: string | null;
    setDateFrom: (value: string | null) => void;
    setDateUntil: (value: string | null) => void;
    setActiveTab: (tab: string) => void;
    setSearchInput: (input: string) => void;
    setPage: (page: number) => void | number
    searchInput: string
    isSearchValues: string
    setIsSearchValues: (input: string) => void;
}