export interface ICreateUserBody {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    workerRole: string;
    identityNumber: string;
    outletId: string;
    motorcycleType?: string
    plateNumber?: string   
    shiftId: string;
}


export interface IFormikCreateWorkerWeb{
    getDataStore: { storeId: string; storeName: string }[];
    isPending: boolean;
    handleCreateUser: any
    setIsValuePhoneNumber: (value: string) => void;
    isValuePhoneNumber: string;
}





