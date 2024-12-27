export interface ITableAddress {
    address: any,
    currentPage: number,
    entriesPerPage: number,
    i: number,
    onChangeMainAddress: () => void,
    isPendingDelete: boolean,
    onDeleteAddress: () => void
}