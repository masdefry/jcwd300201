import { IAddress } from "../addressSectionComponent/type";
import { IOrderType } from "@/app/(admin)/admin/order/type";

export interface IStore {
    id: string;
    storeName: string;
    address: string;
    distance: number;
}

export interface IPickupFormProps {
    dataOrderType: IOrderType[] | undefined;
    dataOrderTypeLoading: boolean;
    dataNearestStoreLoading: boolean;
    setOpenDialog: (open: boolean) => void;
    dataMainAddressLoading: boolean;
    dataNearestStore: IStore[];
    dataMainAddress: IAddress | null;
    selectedAddress: IAddress | null;
    handlePickupRequest: (values: any, callbacks: { onSuccess: () => void }) => void;
    pickupValidationSchema: any; // Replace with appropriate Yup schema type if using Yup
    PendingPickupSubmit: boolean;
    isDisabledSucces: boolean;
}