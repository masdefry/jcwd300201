export interface Worker {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface OrderStatus {
    status: string;
    Worker?: Worker;
}

export interface OrderData {
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

export interface IOrderDialogAdminOutlet {
    orderData: OrderData;
}