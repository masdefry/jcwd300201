import { Dispatch, SetStateAction } from 'react';

export interface IUser {
    firstName: string;
    lastName: string;
}

export interface IOrder {
    id: string;
    isSolved: boolean;
    isProcessed: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    isConfirm: boolean;
}
export interface IOrderStatus {
    status: string;
}
export interface IOrderContentMobile {
    order: IOrder;
    setOrderData: Dispatch<SetStateAction<IOrder[] | null>>
    handleOrderDetail: (orderId: string) => void;
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}