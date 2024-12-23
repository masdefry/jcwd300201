import { ReactNode } from "react";

export default function PaginationWebLayout({ children, currentPage, totalPages }: { children: ReactNode, currentPage: number, totalPages: number }) {
    return (
        <div className='flex gap-2 justify-between py-2 px-2 items-center'>
            <div className="w-1/2 flex">
                <h1 className="text-neutral-400">Page {currentPage} of {totalPages || '0'}</h1>
            </div>
            <div className="flex gap-2">
                {children}
            </div>
        </div>
    );
}