export interface IDeliveryContent {
    order: any;
    handleProcessDelivery: (id: string) => void;
    handleAcceptOrderDelivery: (id: string) => void;
    handleProcessDeliveryPending?: boolean;
    handleAcceptOrderDeliveryPending?: boolean;
}