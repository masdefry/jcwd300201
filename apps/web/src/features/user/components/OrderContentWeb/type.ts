
interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrder {
    id: string;
    isSolved: boolean;
    OrderType: IOrderType;
    isProcessed: boolean;
    createdAt: string;
    orderStatus: any;
    User: IUser;
    laundryPrice: number
    isConfirm: boolean;
}

interface IOrderType {
    type: string
}

export interface IOrderContentWeb {
    order: IOrder;
    page: number
    i: number
    setOrderData: (data: any) => void;
    handleOrderDetail: (orderId: string) => void;
    setOpenDialog: (open: boolean) => void;
    entriesPerPage:number
}