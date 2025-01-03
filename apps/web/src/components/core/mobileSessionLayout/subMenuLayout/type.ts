import { ReactNode } from "react";

export interface IContentMobile {
    outletId?: string | null;
    setOutletId?: (id: string) => void;
    getDataStore?: Array<{ storeId: string, storeName: string }>;
    isStoreLoading?: boolean;
    isStoreError?: boolean;
    showStoreSelect?: boolean;
    children: ReactNode;
    title : string
}