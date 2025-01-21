export interface ITableAddress {
    address: string,
    currentPage: number,
    entriesPerPage: number,
    i: number,
    onChangeMainAddress: () => void,
    isPendingDelete: boolean,
    onDeleteAddress: () => void
}