interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrderType {
    type: string;
}

interface IOrder {
    User: IUser;
    OrderType: IOrderType;
}

export interface IWidgetDashboardMobileDriver {
    data: {
        orders: IOrder[];
    };
    title: string
    link?:string

}

