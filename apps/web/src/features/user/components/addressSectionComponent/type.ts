
export interface IAddressPopUpDialogProps {
    setUserAddress: (id: string) => void;
    handleAddressSelect: (address: IAddress) => void;
    dataAllAddress: IAddress[] | undefined;
    dataAllAddressLoading: boolean;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}

export interface IAddress {
    id: string
    addressName: string
    addressDetail: string
    city: string
    street: string
    state: string
    postalCode: string
    country:string
    province: string
    zipCode: number
    User: IUser
}
export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
}
