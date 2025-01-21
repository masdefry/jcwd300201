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
    orderTypeId:number
}

export interface IOrderStatus {
    status: string;
} 
interface IOrderType{
    type:string
}

export interface IIroningContentWebProps {
    order: IOrder;
    handleProcessIroning: (orderId: string) => void;
    isPending: boolean;
    router: ReturnType<typeof useRouter>;
    page: number
    limit: number
    i: number
}