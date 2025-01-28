export interface IFormikCreateWorkerMobile {
    getDataStore: { storeId: string; storeName: string }[];
    isPending: boolean; 
    handleCreateUser: any
    setIsValuePhoneNumber: (value: string) => void; 
    isValuePhoneNumber: string;
}






