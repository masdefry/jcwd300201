export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}
export type PaymentMethod = 'MIDTRANS' | 'TF_MANUAL' ;

export interface IOrder {
    id: string;
    isPaid: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    paymentMethod: PaymentMethod;
    paymentProof: string;
}

export interface IPaymentContent {
    order: IOrder;
    imageLoading: boolean;
    setImageLoading: (loading: boolean) => void;
    handlConfirmPaymentPending: boolean;
    handleConfirmPayment: (orderId: string) => void;
}
