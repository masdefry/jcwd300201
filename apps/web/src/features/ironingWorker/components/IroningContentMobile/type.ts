
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
    OrderType: { type: string }
    orderTypeId: number
}

export interface IIroningContentMobileProps {
    order: IOrder;
    handleProcessIroning: (orderId: string) => void;
    isPending: boolean;
    router: any
}