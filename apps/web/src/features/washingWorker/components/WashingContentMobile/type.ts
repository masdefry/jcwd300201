
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
}

export interface IWashingContentMobileProps {
    order: IOrder;
    handleProcessWashing: (orderId: string) => void;
    isPending: boolean;
    router: any
}