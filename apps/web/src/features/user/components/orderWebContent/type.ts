import { Dispatch, SetStateAction } from 'react';

export interface IUser {
    firstName: string;
    lastName: string;
}

export interface IOrder {
    id: string;
    isSolved: boolean;
    OrderType: IOrderType;
    isProcessed: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    laundryPrice: number
    isConfirm: boolean;
}
export interface IOrderStatus {
    status: any;
}
export interface IOrderType {
    type: string
}

export interface IOrderContentWeb {
    order: IOrder;
    page: number
    i: number
    setOrderData: Dispatch<SetStateAction<IOrder[] | null>>
    handleOrderDetail: (orderId: string) => void;
    setOpenDialog: Dispatch<SetStateAction<boolean>>
    entriesPerPage: number
}