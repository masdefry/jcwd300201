export interface IOrderType {
    id: number;
    type: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface IRequestPickup {
    deliveryFee: number;
    outletId: string;
    orderTypeId: string;
    userAddressId: number
}
export interface IAddress {
    id: string;
    addressName: string;
    addressDetail: string;
    city: string;
    province: string
}
