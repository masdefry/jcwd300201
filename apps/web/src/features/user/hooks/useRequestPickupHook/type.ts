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
    User: IUser;
    addressName: string
    addressDetail: string
    province:string
    zipCode:number
}

export interface IOrderType {
    id: string;
    name: string;
    description?: string;
    type: string;
}

export interface IRequestPickup {
    deliveryFee: number;
    outletId: string;
    orderTypeId: string;
    userAddressId: string;
    User: IUser
}

interface IUser {
    id: number;
    firstName: string;
    lastName: string;
}

