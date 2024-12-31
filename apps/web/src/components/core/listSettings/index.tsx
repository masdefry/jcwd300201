import Link from "next/link";
import { ReactNode } from "react";

export default function ListCustom({ children, py = 'py-2', caption, url, border = 'border-b' }: { py?: string, children: ReactNode, caption: string, url: string, border?: string }) {
    return (
        <Link href={url} className={`w-full ${py} px-5 bg-white rounded-xl ${border}`}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-5 text-neutral-700">
                    {children}
                    <h1 className="text-neutral-500">{caption}</h1>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-700"></div>
            </div>
        </Link>
    );
}