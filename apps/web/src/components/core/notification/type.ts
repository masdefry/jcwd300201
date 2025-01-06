interface IUser {
    firstName: string;
    lastName: string;
}

interface IOrderType {
    type: string;
}

interface IOrder {
    id: number;
    User: IUser;
    OrderType: IOrderType;
}

interface IDataOrderNotif {
    orders: IOrder[];
}

export interface INotificationProps {
    dataOrderNotif?: IDataOrderNotif;
}
