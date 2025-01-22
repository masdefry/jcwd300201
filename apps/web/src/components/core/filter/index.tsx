import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaSearch } from 'react-icons/fa';
import { IoMdRefresh } from "react-icons/io";
import { IFilterProps } from "./type";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function FilterWorker({ setIsSearchValues, isSearchValues, searchInput, setPage, debounce, sortOption, setSortOption, dateFrom, dateUntil, setDateFrom, setDateUntil, setActiveTab, setSearchInput }: IFilterProps) {
    return (
        <>
            <div className="w-full h-fit relative">
                <section className="flex gap-1 w-full h-fit items-center">
                    <div className="w-full h-fit">
                        <div className="relative w-full">
                            <input type="text" onChange={(e) => {
                                setIsSearchValues(e.target.value)
                                debounce(e.target.value)
                                setPage(1)
                            }} value={isSearchValues} placeholder="Cari..." className="w-full pl-10 pr-4 py-2 text-sm border z-0 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500" />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                    <div className="flex justify-start items-end">
                        <button className="flex items-center justify-end h-fit py-2 rounded-xl w-10 px-2 border"
                            onClick={() => {
                                setSortOption("date-asc")
                                setDateFrom(null)
                                setDateUntil(null)
                                setSearchInput('')
                                setPage(1)
                                setIsSearchValues('')
                            }}><IoMdRefresh size={20} />
                        </button>
                    </div>
                    <div className="w-fit py-2 flex items-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button><FaEllipsisVertical className="text-xl" /></button>
                            </DialogTrigger>
                            <DialogContent className="w-fit rounded-xl p-4 px-5 pb-5">
                                <DialogHeader>
                                    <DialogTitle className="text-lg text-left font-semibold">Sortir Data</DialogTitle>
                                    <DialogDescription className="text-sm text-center text-gray-500"></DialogDescription>
                                </DialogHeader>
                                <section className="gap-2 bg-white space-y-2 w-full h-fit justify-center items-center">
                                    <Select value={sortOption} onValueChange={setSortOption}>
                                        <SelectTrigger className="w-full md:w-[150px] border rounded-md py-2 px-3">
                                            <SelectValue placeholder="Sort By" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Sortir</SelectLabel>
                                                <SelectItem value="date-asc">Tanggal Terlama</SelectItem>
                                                <SelectItem value="date-desc">Tanggal Terbaru</SelectItem>
                                                <SelectItem value="name-asc">Nama Cust. A-Z</SelectItem>
                                                <SelectItem value="name-desc">Nama Cust. Z-A</SelectItem>
                                                <SelectItem value="order-id-asc">Order Id A-Z</SelectItem>
                                                <SelectItem value="order-id-desc">Order Id Z-A</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <div className='w-full h-fit'>
                                        <label className="flex flex-col">
                                            <span className="text-xs text-gray-500">Start Date</span>
                                            <input type="date" name="startDate" value={dateFrom ?? ''}
                                                onChange={(e) => {
                                                    setPage(1);
                                                    setDateFrom(e.target.value);
                                                }} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500 text-sm" />
                                        </label>
                                    </div>
                                    <div className='w-full h-fit'>
                                        <label className="flex flex-col">
                                            <span className="text-xs text-gray-500">End Date</span>
                                            <input type="date" name="endDate" value={dateUntil ?? ''}
                                                onChange={(e) => {
                                                    setPage(1);
                                                    setDateUntil(e.target.value);
                                                }} className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-orange-500 text-sm" />
                                        </label>
                                    </div>
                                </section>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
            </div>
        </>
    )
}