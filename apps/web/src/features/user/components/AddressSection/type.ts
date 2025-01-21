
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
    province: string
}