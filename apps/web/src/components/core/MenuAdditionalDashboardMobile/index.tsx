import Link from "next/link"
import { IconMenuDashboardMobileProps } from "./type"

export default function MenuAdditionalDashboardMobile({ arrMenu }: IconMenuDashboardMobileProps) {
    return (
        <div className="w-full md:w-1/2 h-auto">
            <div className="grid grid-cols-1 gap-3 w-full">
                {arrMenu?.map((menu, i) => (
                    <Link href={menu?.url} key={i} className="w-full flex gap-3 items-center py-3 px-4 bg-white border rounded-lg shadow-sm hover:bg-gray-100 transition-all">
                        <span className="text-lg text-neutral-500">{menu?.icon}</span>
                        <span className="text-sm text-neutral-700">{menu?.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}