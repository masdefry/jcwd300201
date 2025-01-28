export interface ITableAddress {
    address: IUserAddress,
    currentPage: number,
    entriesPerPage: number,
    i: number,
    onChangeMainAddress: () => void,
    isPendingDelete: boolean,
    onDeleteAddress: () => void
}

export interface IUserAddress {
    id: number;
    addressName: string;
    addressDetail: string; 
    province: string;
    city: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    country: string;
    isMain:boolean
}