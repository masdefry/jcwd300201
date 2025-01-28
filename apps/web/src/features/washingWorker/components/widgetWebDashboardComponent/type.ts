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

interface IWidgetDashboardWeb {
    data: {
        orders: IOrder[];
    };
    title: string
    dataOrderNotif:any
    hrefLihatSelengkapnya?: string,
    hrefProses?: string
}