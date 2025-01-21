import { Dispatch, SetStateAction } from 'react';

interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrder {
    id: string;
    isSolved: boolean;
    OrderType: IOrderType;
    isProcessed: boolean;
    createdAt: string;
    orderStatus: IOrderStatus;
    User: IUser;
    laundryPrice: number
    isConfirm: boolean;
}
export interface IOrderStatus {
    status: string;
}
interface IOrderType {
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