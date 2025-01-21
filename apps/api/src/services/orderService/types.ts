import { Role } from "@prisma/client"

export interface IFindNearestStore {
    userId: string,
    address: string,
}

export interface IRequestPickup {
    userId: string
    laundryPrice?: number
    deliveryFee: number
    outletId: string
    orderTypeId: string
    userAddressId: number
}

export interface IGetUserOrder {
    userId: string;
    limit_data: number | string;
    page: number | string;
    search?: string;
    dateUntil?: string;
    dateFrom?: string;
    sort?: 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc' | 'order-id-asc' | 'order-id-desc'; // Optional, with specific string values.

}
export interface IGetOrderForDriver {
    userId: string;
    limit_data: number | string;
    page: number | string;
    search?: string;
    dateUntil?: string;
    dateFrom?: string;
    sort?: 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc' | 'order-id-asc' | 'order-id-desc'; // Optional, with specific string values.
    tab?: string;
    authorizationRole?: string;
    storeId?: string
}

export interface IAcceptOrder {
    email: string;
    orderId: string;
    userId: string
}

export interface IAcceptOrderOutlet {
    email: string;
    orderId: string;
    userId: string;
}

export interface IGetOrderNoteDetail {
    id: string;
    userId: string;
    authorizationRole: string;
    storeId: string;
}

export interface IGetOrdersForWashing {
    totalPage: number;
    orders: IOrder;
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
    OrderType: { type: string }
    Store: { storeName: string }
    paymentMethod: PaymentMethod;
    paymentProof: string
    totalPrice: number
}
export interface IGetPackingHistory {
    userId: string,
    authorizationRole: Role,
    storeId: string,
    limit_data: string,
    page: string,
    search: string,
    dateFrom: string,
    dateUntil: string,
    sort: string,
}

export interface IGetIroningHistory {
    userId: string,
    authorizationRole: Role,
    storeId: string,
    limit_data: string,
    page: string,
    search: string,
    dateFrom: string,
    dateUntil: string,
    sort: string,
}

export interface IGetWashingHistory {
    userId: string,
    authorizationRole: Role,
    storeId: string,
    limit_data: string,
    page: string,
    search: string,
    dateFrom: string,
    dateUntil: string,
    sort: string,
}

export interface IGetNotes {
    userId: string,
    authorizationRole: Role,
    tab: string,
    limit_data: string,
    page: string,
    search: string,
    dateFrom: string,
    dateUntil: string,
    sort: string,
}

export interface ICreateOrder {
    orderId: string,
    email: string,
    userId: string,
    totalWeight: number,
    laundryPrice: number,
    items: { itemName: string, quantity: number }[],
}
export interface IPaymentOrder {
    orderId: string,
    email: string,
    userId: string,
}
export interface IPaymentOrderTf {
    orderId: string,
    email: string,
    userId: string,
    paymentProof: string
}
export interface IPaymentTfOrder {
    orderId: string,
    email: string,
    userId: string,
}

export interface IWashingProcessDone {
    orderId: string,
    email: string,
    userId: string,
}
export interface IStatusOrder {
    storeId: string,
    orderId: string,
    email: string,
    userId: string,
}
export interface IIroningProcessDone {
    orderId: string,
    email: string,
    userId: string,
}

export interface IGeDriverHistory {
    tab: string,
    userId: string,
    authorizationRole: Role,
    storeId: string,
    limit_data: string,
    page: string,
    search: string,
    dateFrom: string,
    dateUntil: string,
    sort: string,
}

export interface IOrderTrackingAdminParams {
    userId: string;
    authorizationRole: Role
    period: string | undefined;
    storeId?: string;
    outletId: string
}
export interface IOrderTrackingDriverParams {
    userId: string;
    authorizationRole: Role
    period: string | undefined;
    storeId?: string;
}

export interface IOrderStats {
    _sum: {
        laundryPrice: number | null;
        totalWeight: number | null;
    };
    _count: {
        id: number;
    };
}

export interface ITotalPcs {
    _count: {
        id: number;
    };
}

export interface IOrderTrackingAdminResponse {
    totalPcs: ITotalPcs;
    stats: IOrderStats;
}

export interface IOrderTrackingUser {
    userId: string;
    period: string | undefined;
}

export interface ISolveNotesInput {
    orderId: string;
    userId: string;
    notes: string;
}
