export  interface IUserAddress {
    id: number;
    addressName: string;
    addressDetail: string;
    city: string;
    isMain: boolean;
    province: string;
    country: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    userId?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    order: IOrder[];
    User?: IUser;
}






