
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
    orderTypeId:number
}

interface IOrderType{
    type:string
}

export interface IIroningContentWebProps {
    order: IOrder;
    handleProcessIroning: (orderId: string) => void;
    isPending: boolean;
    router: any
    page: number
    limit: number
    i: number
}