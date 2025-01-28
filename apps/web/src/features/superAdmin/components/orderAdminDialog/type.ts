interface Worker {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface OrderStatus {
    status: string;
    Worker?: Worker;
}

interface OrderData {
    order: {
        id: string;
        OrderType: {
            type: string;
        };
        createdAt: string;
        complaintText?: string;
        isComplain?: boolean;
        deliveryFee: number;
        laundryPrice: number;
        User:{phoneNumber:string}
    };
    orderStatus: OrderStatus[];
}

interface IOrderDialogAdmin {
    orderData: OrderData;
}