export interface IOrder {
    id: string;
    createdAt: string;
    orderStatus: { status: string }[];
    orderTypeId?: number;
    User: {
        firstName: string;
        lastName: string;
    };
    OrderType: {
        type: string;
    };
    isProcessed: boolean;
    isSolved: boolean;
}

export interface IHistoryContentWeb {
    order: IOrder;
    page: number;
    limit: number;
    i: number;
}