export interface IOrderData {
    order: {
        id: string;
        createdAt: string;
        isPaid: boolean;
        isConfirm: boolean;
        isDone: boolean;
        isReqDelivery: boolean;
        isComplain: boolean;
        deliveryFee: number;
        laundryPrice: number;
        paymentProof?: string;
        paymentMethod?: string;
        OrderType?: {
            type: string;
        };
    };
    orderStatus: Array<{
        status: string;
        Worker?: {
            firstName?: string;
            lastName?: string;
            phoneNumber?: string;
        };
    }>;
}

export interface IOrderPopUpDialog {
    openDialog: boolean;
    orderData?: IOrderData;
    setOpenDialog: (isOpen: boolean) => void;
    router: {
        push: (path: string) => void;
    };
    handleOrderConfirmation: (orderId: string) => void;
    handleOrderConfirmationPending: boolean;
    handleSolveComplaint: (orderId: string) => void;
    handleSolveComplaintPending: boolean;
}