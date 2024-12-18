export interface IPagination{
    setPage: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    totalPages:number
}