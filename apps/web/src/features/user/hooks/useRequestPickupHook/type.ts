export interface IAddress {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    isPrimary?: boolean;
}

export interface IOrderType {
    id: string;
    name: string;
    description?: string;
}

export interface IRequestPickup {
    deliveryFee: number;
    outletId: string;
    orderTypeId: string;
    userAddressId: string;
}