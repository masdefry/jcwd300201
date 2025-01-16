export interface ICreateUserBody {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    workerRole: string;
    identityNumber: string;
    outletId: string;
    motorcycleType?: any
    plateNumber?: any   
    shiftId: string;
}


export interface IFormikCreateWorkerWeb{
    getDataStore: { storeId: string; storeName: string }[];
    isPending: boolean;
    handleCreateUser: any
    setIsValuePhoneNumber: (value: string) => void;
    isValuePhoneNumber: string;
}





