import { FaSearch } from "react-icons/fa";

export default function SearchInputCustom({ onChange, placeholder = "Cari...", value }: { onChange?: any, placeholder?: string, value?: string | number | readonly string[] | undefined }) {
    return (
        <div className="relative flex">
            <input
                value={value}
                onChange={onChange}
                type="text" className="px-3 py-2 border rounded-2xl text-sm focus:outline-none focus:border focus:border-orange-500" placeholder={placeholder} />
            <span className='absolute top-3 right-5 text-neutral-500'><FaSearch /> </span>
        </div>
    );
}