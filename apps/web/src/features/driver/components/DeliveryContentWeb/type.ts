export interface IDeliveryContentWeb {
    order: IOrder;
    handleProcessDelivery: (id: string) => void;
    handleAcceptOrderDelivery: (id: string) => void;
    handleProcessDeliveryPending?: boolean;
    handleAcceptOrderDeliveryPending?: boolean;
    page: number;
    limit: number;
    i:number
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
    orderTypeId: number
}
