export interface IUser {
    firstName: string;
    lastName: string;
}

export interface IOrderType {
    type: string;
}

export interface IOrder {
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

