export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    id: string;
    status:
    | 'AWAITING_DRIVER_PICKUP'
    | 'DRIVER_TO_OUTLET'
    | 'DRIVER_ARRIVED_AT_OUTLET'
    | 'IN_WASHING_PROCESS'
    | 'IN_IRONING_PROCESS'
    | 'IN_PACKING_PROCESS'
    | 'DRIVER_TO_CUSTOMER'
    | 'DRIVER_DELIVERED_LAUNDRY';
    createdAt: string;
}

export interface IOrder {
    id: string;
    isConfirm: boolean;
    isDone: boolean;
    createdAt: string;
    User: IUser; 
    orderStatus: IOrderStatus[];
    isPaid: boolean; 
    Store: IStore
    OrderType:IOrderType
}

export interface IStore {
    id: string;
    storeName: string; 
    address: string; 
    phoneNumber: string; 
}

export interface IOrderType {
    id: string; 
    name: string; 
    description?: string; 
    type: string;
    
}