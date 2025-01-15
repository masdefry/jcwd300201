
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
    isDone: any
}

export interface IPackingContentMobileProps {
    order: IOrder;
    handleProcessPacking: (orderId: string) => void;
    isPending: boolean;
    router: any
}