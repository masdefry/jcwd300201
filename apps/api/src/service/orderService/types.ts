import { Role } from "@prisma/client"

export interface IFindNearestStore {
    userId: string,
    address: string,
}

export interface IRequestPickup {
    userId: string
    totalPrice: number
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
    orders: any[];
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

export interface ICreateOrder{
    orderId: string,
    email: string,
    userId: string,
    totalWeight: number,
    totalPrice: number,
    items: { itemName: string, quantity: number }[],
}

export interface IWashingProcessDone {
    orderId:string,
    email: string,
    userId: string,
}
export interface IIroningProcessDone {
    orderId:string,
    email: string,
    userId: string,
}
