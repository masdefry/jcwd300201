export interface IItem {
    id: number;
    itemName: string;
    laundryItemId: number;
    quantity: number;
    weight: number;
}

export interface IOrderNote {
    User: {
        firstName: string;
        lastName: string;
    };
    UserAddress: {
        addressDetail: string;
        city: string;
        province: string;
    };
    OrderType: {
        type: string;
        price: number;
    };
}

export interface IFormikAdminOutletWeb {
    dataItemName: IItem[];
    dataOrderNote: IOrderNote[];
    isDisabledSucces: boolean;
    setIsCheckedItem: (checked: boolean) => void;
    isCheckedItem: boolean;
    handleCreateNotaOrder: (notaOrder: {
        email: string;
        totalWeight: number;
        laundryPrice: number;
        items: { laundryItemId: number; quantity: number }[];
    }) => void;
    email: string;
    createNotaPending: boolean;
}