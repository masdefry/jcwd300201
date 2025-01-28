import { WeekNumberLabel } from "react-day-picker";

export interface IPickupContent {
    order: IOrder;
    handleProcessOrder: (id: string) => void;
    handleProcessOrderOutlet: (id: string) => void;
    handleProcessOrderPending?: boolean;
    handleProcessOrderOutletPending?: boolean;
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
    UserAddress: IUserAddress
    isReqDelivery:boolean
}

export interface IUserAddress{
    latitude: number;
    longitude:number
}


