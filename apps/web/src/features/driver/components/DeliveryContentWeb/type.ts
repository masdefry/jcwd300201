export interface IDeliveryContentWeb {
    order: any;
    handleProcessDelivery: (id: string) => void;
    handleAcceptOrderDelivery: (id: string) => void;
    handleProcessDeliveryPending?: boolean;
    handleAcceptOrderDeliveryPending?: boolean;
    page: number;
    limit: number;
    i:number
}