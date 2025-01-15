export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}

export interface IOrder {
    id: string;
    isPaid: any;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    paymentMethod: any;
    paymentProof:string
}
export interface IPaymentContent {
    order: IOrder;
    imageLoading: boolean;
    setImageLoading: (loading: boolean) => void;
    handlConfirmPaymentPending: boolean;
    handleConfirmPayment: (orderId: string) => void;
}
