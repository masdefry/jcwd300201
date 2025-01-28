import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { IoMdRefresh } from "react-icons/io";
import { IFilterPropsWeb } from "./type";
import SearchInputCustom from "../searchBarCustom";
import { ChangeEvent } from "react"

export default function FilterWeb({ showTabOption = true, borderReset = 'border rounded-lg border-gray-500',
    isSearchValues, setIsSearchValues, options, showStoreSelect = false, activeTab, setActiveTab,
    getDataStore, outletId, setPage, setOutletId, isStoreLoading, isStoreError, debounce, sortOption,
    setSortOption, dateFrom, dateUntil, setDateFrom, setDateUntil, setSearchInput }: IFilterPropsWeb) {

    return (
        <>
            <div className="w-full h-fit flex flex-col items-center gap-2">
                <div className="w-full h-fit flex  justify-between items-center ">
                    <div className="h-full flex items-end gap-2 text-sm  text-neutral-700">
                        <div className="flex flex-col">
                            <span className="text-xs text-neutral-700">Sortir</span>
                            <Select value={sortOption} onValueChange={setSortOption}>
                                <SelectTrigger className="w-[150px] focus:border-orange-500 border-gray-300 focus:ring-0 border text-sm text-neutral-700 rounded-2xl h-10 py-2 px-3">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date-asc">Tanggal Terlama</SelectItem>
                                    <SelectItem value="date-desc">Tanggal Terbaru</SelectItem>
                                    <SelectItem value="name-asc">Nama Cust. A-Z</SelectItem>
                                    <SelectItem value="name-desc">Nama Cust. Z-A</SelectItem>
                                    <SelectItem value="order-id-asc">Order Id A-Z</SelectItem>
                                    <SelectItem value="order-id-desc">Order Id Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {showTabOption && (
                            <div className="flex flex-col">
                                <span className="text-xs text-neutral-700">Status</span>
                                <select name="searchOrder" value={activeTab} onChange={(e) => {
                                    setActiveTab(e.target.value)
                                    setPage(1)
                                }} id="searchWorker" className="px-4 py-2 border rounded-2xl border-gray-300 focus:outline-none focus:border focus:border-orange-500 h-10 text-sm text-neutral-700">
                                    <option value="" disabled>-- Pilih Opsi --</option>
                                    {options?.map((option, index) => (
                                        <option key={index} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <label className="flex flex-col ">
                            <span className="text-xs text-neutral-700">
                                Start Date
                            </span>
                            <input
                                type="date"
                                name="startDate"
                                value={dateFrom ?? ''}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="border text-sm text-neutral-700 rounded-2xl h-10 px-4 border-gray-300 focus:outline-none focus:border-orange-500"
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-xs  text-neutral-700">End Date</span>
                            <input
                                type="date"
                                name="endDate"
                                value={dateUntil ?? ''}
                                onChange={(e) => setDateUntil(e.target.value)}
                                className="border text-sm text-neutral-700 rounded-2xl border-gray-300 h-10 px-4 focus:outline-none focus:border-orange-500"
                            />
                        </label>
                    </div>

                    <div className="flex gap-2 h-full justify-end items-end">
                        {showStoreSelect && (
                            <div className="flex gap-2 h-full items-end">
                                <select
                                    className="ml-2 border rounded-2xl h-10 px-4 text-sm text-neutral-700"
                                    value={outletId || ""}
                                    onChange={(e) => setOutletId?.(e.target.value)}
                                    disabled={isStoreLoading || isStoreError}
                                >
                                    <option value="" disabled>
                                        {isStoreLoading
                                            ? "Memuat..."
                                            : isStoreError
                                                ? "Gagal Memuat"
                                                : "Pilih Toko"}
                                    </option>
                                    <option value="">Semua</option>
                                    {getDataStore?.map((store: any) => (
                                        <option key={store?.storeId} value={store?.storeId}>
                                            {store?.storeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="w-1/2 h-fit flex gap-2 justify-end">
                            <SearchInputCustom
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setIsSearchValues(e.target.value)
                                    debounce(e.target.value)
                                }}
                                value={isSearchValues}
                            />
                        </div>
                        <button className={`flex items-center justify-center h-10 w-10 px-2 ${borderReset} mr-2`}
                            onClick={() => {
                                setSortOption("date-asc")
                                setDateFrom(null)
                                setDateUntil(null)
                                setSearchInput('')
                                setIsSearchValues('')
                            }}>
                            <IoMdRefresh size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}