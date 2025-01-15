
interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrder {
    id: string;
    isSolved: boolean;
    isProcessed: boolean;
    createdAt: string;
    orderStatus: any;
    User: IUser;
    isConfirm: boolean;
}

export interface IOrderContentMobile {
    order: IOrder;
    setOrderData: (data: any) => void;
    handleOrderDetail: (orderId: string) => void;
    setOpenDialog: (open: boolean) => void;
}