
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
}

interface IOrderType{
    type:string
}

export interface IWashingContentWebProps {
    order: IOrder;
    handleProcessWashing: (orderId: string) => void;
    isPending: boolean;
    router: any
    page: number
    limit: number
    i: number
}