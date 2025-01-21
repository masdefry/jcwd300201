import { useRouter } from "next/navigation";

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
    orderStatus: IOrderStatus[];
    User: IUser;
    orderTypeId?: number
    isDone: boolean
}
export interface IOrderStatus {
    status: string;
}
interface IOrderType {
    type: string
}

export interface IPackingContentWebProps {
    order: IOrder;
    handleProcessPacking: (orderId: string) => void;
    isPending: boolean;
    router: ReturnType<typeof useRouter>;
    page: number
    limit: number
    i: number
}