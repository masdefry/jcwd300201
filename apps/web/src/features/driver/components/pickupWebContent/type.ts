import { QueryObserverResult } from "@tanstack/react-query";

export interface IPickupContentWeb {
    order: IOrder;
    handleProcessOrder: (id: string) => void;
    handleProcessOrderOutlet: (id: string) => void;
    handleProcessOrderPending?: boolean;
    handleProcessOrderOutletPending?: boolean;
    page: number;
    entriesPerPage: number;
    i: number;
    refetch: () => Promise<QueryObserverResult<any, Error>>
}

export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}
type PaymentMethod = 'MIDTRANS' | 'TF_MANUAL';

export interface IOrder {
    id: string;
    isPaid: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    paymentMethod: PaymentMethod;
    paymentProof: string
    notes: string
    isSolved: boolean
    orderTypeId?: number
    OrderType:any
}
