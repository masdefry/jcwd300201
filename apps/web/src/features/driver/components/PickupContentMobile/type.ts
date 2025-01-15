export interface IPickupContent {
    order: any;
    handleProcessOrder: (id: string) => void;
    handleProcessOrderOutlet: (id: string) => void;
    handleProcessOrderPending?: boolean;
    handleProcessOrderOutletPending?: boolean;
}

