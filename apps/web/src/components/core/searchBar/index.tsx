import { FaSearch } from "react-icons/fa";

export default function SearchInputCustom({ onChange }: { onChange: any }) {
    return (
        <div className="relative flex">
            <input
                onChange={onChange}
                type="text" className="px-3 py-2 border rounded-2xl text-sm focus:outline-none focus:border focus:border-yellow-400" placeholder="Cari pekerja.." />
            <span className='absolute top-3 right-5 text-neutral-500'><FaSearch /> </span>
        </div>
    );
}