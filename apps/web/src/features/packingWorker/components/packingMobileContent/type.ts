import { useRouter } from "next/navigation";

interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrder {
    id: string;
    isSolved: boolean;
    isProcessed: boolean;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    OrderType: { type: string }
    orderTypeId?: number
    isDone: boolean
}
export interface IOrderStatus {
    status: string;
}
export interface IPackingContentMobileProps {
    order: IOrder;
    handleProcessPacking: (orderId: string) => void;
    isPending: boolean;
    router: ReturnType<typeof useRouter>;
}