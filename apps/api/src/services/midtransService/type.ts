export interface IHandleMidtransNotification {
    orderId: string;
    transactionStatus: "settlement" | "capture" | string;
}