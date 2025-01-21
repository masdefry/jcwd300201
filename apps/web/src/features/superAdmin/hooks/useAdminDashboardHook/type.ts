interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrderType {
    type: string;
}

interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface IOrderStatus {
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
    isDone: boolean
    notes: string
    isConfirm: boolean
    isSolved: boolean
    orderTypeId?: number
    OrderType: IOrderType
}

