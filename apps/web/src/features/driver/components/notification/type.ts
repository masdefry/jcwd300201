export interface IUser {
    firstName: string;
    lastName: string;
}

export interface IOrderType {
    type: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}
export type PaymentMethod = 'MIDTRANS' | 'TF_MANUAL';

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
    OrderType: IOrderType
}


export interface IDataOrderNotif {
    orders: IOrder[];
}

export interface INotificationProps {
    dataOrderNotif: IDataOrderNotif;
}
