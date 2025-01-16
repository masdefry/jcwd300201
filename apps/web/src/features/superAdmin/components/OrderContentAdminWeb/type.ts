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
    OrderType: { type: string }
    Store:{storeName:string}
}
export interface IOrderContentWeb {
    order: IOrder;
    page: number;
    i: number
    setOrderData: (data: any) => void; 
    handleOrderDetail: (id: any) => void; 
    setOpenDialog: (open: any) => void;
    entriesPerPage: number
}