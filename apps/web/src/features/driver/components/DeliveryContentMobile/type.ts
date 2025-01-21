export interface IDeliveryContent {
    order: IOrder;
    handleProcessDelivery: (id: string) => void;
    handleAcceptOrderDelivery: (id: string) => void;
    handleProcessDeliveryPending?: boolean;
    handleAcceptOrderDeliveryPending?: boolean;
}

interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface IOrderStatus {
    status: any;
}
type PaymentMethod = 'MIDTRANS' | 'TF_MANUAL';

interface IOrder {
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
}
