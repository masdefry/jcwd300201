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
    isPaid: any;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
}
export interface IOrderContent {
    order: IOrder;
    setOrderData: (data: any) => void; 
    handleOrderDetail: (id: string) => void;
    setOpenDialog: (open: boolean) => void;
}
