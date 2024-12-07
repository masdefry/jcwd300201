export interface IOrderType {
    id: number;
    Type: string;
    Price: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
}

export interface IRequestPickup{
    deliveryFee: number;
    storesId: string;
    orderTypeId: string;
    userAddressId:number
}