export type Iitem = {
    id: number;
    itemName: string;
    laundryItemId: number;
    quantity: number;
    weight: number;
};


export interface IFormikIroningMobileProps {
    dataItemName: Iitem[]; 
    dataOrderNote: {
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
        };
    }[]; 
    dataOrderDetail: any[];
    isPending: boolean; 
    isDisabledSucces: boolean; 
    emails: string; 
    handleStatusOrder: (data: { email: string; notes: string }) => void; 
    compareData: (itemOrder: any[], dataOrderDetail: any[]) => boolean; 
    setDialogNotes: React.Dispatch<React.SetStateAction<string>>; 
    setShowDialog: React.Dispatch<React.SetStateAction<boolean>>; 
    setIsCheckedItem: React.Dispatch<React.SetStateAction<boolean>>; 
    isCheckedItem: boolean; 
}