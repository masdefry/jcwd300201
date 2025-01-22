import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaSearch } from 'react-icons/fa';

interface LocationAndSearchProps {
    debounce: (value: string) => void;
}

export default function LocationAndSearch() {
    return (
        <div className="flex justify-between gap-1 items-center">
            <Select>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Pilih Lokasi" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                        <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                        <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                        <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                        <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            <div className="flex items-center justify-center">
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        // onChange={(e) => debounce(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
            </div>
        </div>
    )
}