import { Dispatch, SetStateAction } from 'react';

interface IOrderStatus {
    status: string;
}

interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrderType {
    id: number;
    type: string;
    price: number | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    order: IOrder[];
}

interface IOrder {
    id: string;
    createdAt: string;
    isConfirm: boolean;
    orderStatus: IOrderStatus[];
    User: IUser;
    isSolved: boolean;
    isProcessed: boolean;
    OrderType: IOrderType;
    laundryPrice: number;
}

export interface IOrderContentMobile extends IOrder {
    setOrderData: Dispatch<SetStateAction<IOrder[] | null>>
    handleOrderDetail: (id: string) => void;
    setOpenDialog: Dispatch<SetStateAction<boolean>>
}