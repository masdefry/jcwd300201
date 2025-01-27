export interface IOrderStatus {
    status: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}

export interface IUser {
    firstName: string;
    lastName: string;
}

export interface IOrderType {
    id: number;
    type: string;
    price: number | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    order: IOrder[];
}

export interface IStore {
    id: string;
    storeName: string;
    address: string;
    city: string;
    province: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export type PaymentMethod = 'MIDTRANS' | 'TF_MANUAL';

export interface IOrderPacking {
    id: string;
    createdAt: string;
    isConfirm: boolean;
    orderStatus: IOrderStatus[];
    User: IUser;
    isSolved: boolean;
    isDone: boolean;
    isProcessed: boolean;
    OrderType: IOrderType;
    isPaid: boolean;
    Store: IStore;
    paymentMethod: PaymentMethod;
    paymentProof: string;
    totalPrice: number
    laundryPrice: number
    totalWeight: number;
    isComplain: boolean;
    complaintText: string;
    notes: string;
    orderTypeId:number

}

