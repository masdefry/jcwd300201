import { IPagination } from "./type";

export default function Pagination({page, totalPages, setPage}:IPagination) {
    return (
        <div className="flex justify-between items-center mt-4">
            <button
                onClick={() => setPage((prev: number) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100"
            >
                Previous
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button
                onClick={() => setPage((prev: number) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:bg-gray-100"
            >
                Next
            </button>
        </div>  
    )
}