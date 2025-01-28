export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}

export interface IOrder {
    id: string;
    isPaid: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    OrderType: { type: string }
}
export interface IDeliveryContentWeb {
    order: IOrder;
    handleRequestDelivery: (orderId: string) => void;
    page: number;
    limit: number;
    i: number
}