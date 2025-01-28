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
}
export interface IOrderStatus {
    status: string;
}
interface IOrderType {
    type: string
}

export interface IWashingContentWebProps {
    order: IOrder;
    handleProcessWashing: (orderId: string) => void;
    isPending: boolean;
    router: ReturnType<typeof useRouter>;
    page: number
    limit: number
    i: number
}