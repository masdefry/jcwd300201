import { Dispatch, SetStateAction } from 'react';


export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}

export interface IOrder {
    id: string;
    isPaid: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
}
export interface IOrderContent {
    order: IOrder;
    setOrderData: Dispatch<SetStateAction<IOrder[] | null>>
    handleOrderDetail: (id: string) => void;
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}
