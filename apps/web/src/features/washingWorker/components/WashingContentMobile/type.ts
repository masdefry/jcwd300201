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
}
export interface IOrderStatus {
    status: any;
}
export interface IWashingContentMobileProps {
    order: IOrder;
    handleProcessWashing: (orderId: string) => void;
    isPending: boolean;
    router: ReturnType<typeof useRouter>;
}