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
    OrderType: { type: string }
    Store: { storeName: string }
}
export interface IOrderContentWeb {
    order: IOrder;
    page: number;
    i: number
    setOrderData: Dispatch<SetStateAction<IOrder[] | null>>
    handleOrderDetail: (id: string) => void;
    setOpenDialog: Dispatch<SetStateAction<boolean>>
    entriesPerPage: number
}