import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaSearch } from 'react-icons/fa';
import { IoMdRefresh } from "react-icons/io";
import { IFilterProps } from "./type";


export default function FilterWorker({ debounce, sortOption, setSortOption, dateFrom, dateUntil, setDateFrom, setDateUntil, setActiveTab, setSearchInput }: IFilterProps) {
    return (
        <>
            <div className="flex justify-between gap-1 items-center">
                <div className="flex justify-between gap-1 items-center">
                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                onChange={(e) => debounce(e.target.value)}
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border z-0 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                </div>
                <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-[150px] border rounded-md py-2 px-3">
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
            <div className="flex flex-row gap-3">
                <label className="flex flex-col">
                    <span className="text-sm text-gray-500">
                        Start Date
                    </span>
                    <input
                        type="date"
                        name="startDate"
                        value={dateFrom ?? ''}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                </label>
                <label className="flex flex-col">
                    <span className="text-sm text-gray-500">End Date</span>
                    <input
                        type="date"
                        name="endDate"
                        value={dateUntil ?? ''}
                        onChange={(e) => setDateUntil(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    />
                </label>
                <div>
                    <button className="flex items-center justify-center h-10 w-10 px-2 border rounded-lg border-gray-500 mr-2"
                        onClick={() => {
                            setSortOption("date-asc"),
                                setDateFrom(null),
                                setDateUntil(null),
                                setSearchInput('');
                        }}>
                        <IoMdRefresh size={20} />
                    </button>
                </div>
            </div>
        </>
    )
}