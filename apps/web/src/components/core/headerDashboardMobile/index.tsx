import { FaStore } from "react-icons/fa6";


export default function HeaderDashboardMobile({ name, message, storeName, role, showStore = true }: { role: string, storeName: string, name: string, message: string, showStore?: boolean }) {
    return (
        <div className="w-full h-fit py-5 flex flex-col px-5 bg-orange-500 rounded-3xl shadow-md">
            <div className="flex justify-between text-white">
                <h1 className="text-white font-bold text-xl">Hello, {name && name?.length > 10 ? name?.slice(0, 10) : name || "Admin"}!</h1>
                {showStore && (
                    <>
                        <h1 className="flex items-center gap-1"><FaStore /> {storeName}</h1>
                    </>
                )}
            </div>
            <p className="text-neutral-200 text-sm mt-1">{message}</p>
        </div>
    )
}