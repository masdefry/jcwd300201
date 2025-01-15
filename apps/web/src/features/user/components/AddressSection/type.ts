import { IAddress } from "@/app/(user)/user/dashboard/pickup/type";

export interface IAddressPopUpDialogProps {
    setUserAddress: (id: string) => void;
    handleAddressSelect: (address: IAddress) => void;
    dataAllAddress: IAddress[] | undefined;
    dataAllAddressLoading: boolean;
    openDialog: boolean;
    setOpenDialog: (open: boolean) => void;
}