export interface IDeliveryContent {
    order: IOrder;
    handleProcessDelivery: (id: string) => void;
    handleAcceptOrderDelivery: (id: string) => void;
    handleProcessDeliveryPending?: boolean;
    handleAcceptOrderDeliveryPending?: boolean;
}

export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: any;
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
    isReqDelivery?:boolean
    UserAddress:any
}
