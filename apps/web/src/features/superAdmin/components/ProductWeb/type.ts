export interface IProductContent {
    isPendingDelete: boolean;
    handleUpdateItem: (product: any) => void;
    prod: {
        id: number;
        itemName: string;
        createdAt: string;
    };
    handleDeleteItem: (id: number) => void;
    isPendingUpdate: boolean;
    i: number
    entriesPerPage: number
    currentPage: number
}






