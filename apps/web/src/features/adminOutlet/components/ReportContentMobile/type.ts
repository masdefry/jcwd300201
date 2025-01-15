export interface IUser {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface IOrderStatus {
    status: string;
}

export interface IOrder {
    id: string;
    isPaid: any;
    createdAt: string;
    orderStatus: IOrderStatus[];
    User: IUser;
    paymentMethod: any;
    paymentProof: string
    notes: string
    isSolved: any
}
export interface IReportContent {
    order: IOrder;
    handleLaundryProblem: (data: { notes: string; orderId: string | undefined }) => void;
    isPending: boolean;
    isDisableSuccess: boolean;
}
