import { QueryObserverResult } from "@tanstack/react-query";

export interface IPickupContentWeb {
    order: any;
    handleProcessOrder: (id: string) => void;
    handleProcessOrderOutlet: (id: string) => void;
    handleProcessOrderPending?: boolean;
    handleProcessOrderOutletPending?: boolean;
    page: number;
    entriesPerPage: number;
    i: number;
    refetch: () => Promise<QueryObserverResult<any, Error>>
}