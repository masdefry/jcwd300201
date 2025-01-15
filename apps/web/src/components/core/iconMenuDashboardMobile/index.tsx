import Link from "next/link"
import { IconMenuDashboardMobileProps } from "./type"

export default function IconMenuDashboardMobile({ arrIcon, cols }: IconMenuDashboardMobileProps) {
    return (
        <div className="flex justify-center h-fit w-full p-2 mt-5 bg-gradient-to-tr from-white via-sky-50 to-sky-100 rounded-2xl">
            <div className={`grid grid-cols-${cols} gap-2 w-full`}>
                {arrIcon?.map((item: any, i: number) => (
                    <Link href={item?.url} className="w-full p-3 flex flex-col items-center justify-center gap-2 bg-white shadow-sm border rounded-2xl hover:shadow-md transition-all" key={i}>
                        <span className="text-2xl text-orange-500">{item?.icon}</span>
                        <h1 className="text-xs text-gray-700">{item?.name}</h1>
                    </Link>
                ))}
            </div>
        </div>
    )
}