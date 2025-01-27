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
    OrderType: { type: string }
    Store: { storeName: string }
    paymentMethod: PaymentMethod;
    paymentProof: string
    totalPrice: number
}
export interface IOrderContentWeb {
    order: IOrder;
    page: number;
    i: number
    entriesPerPage: number
    handleConfirmPayment: (orderId: string) => void;

}