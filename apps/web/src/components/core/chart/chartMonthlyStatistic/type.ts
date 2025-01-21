import { QueryObserverResult } from '@tanstack/react-query';


export interface IMonthlyDataItem {
    month: number;
    monthlyStatistics: { _sum: { totalPrice: number | null } }[];
}

export interface IStore {
    storeId: string;
    storeName: string;
}

export interface IMonthlyChartsProps {
    monthlyData: IMonthlyDataItem[];
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    showDropdown?: boolean;
    isLoading?: boolean;
    refetch?: () => Promise<QueryObserverResult<IMonthlyDataItem[], unknown>>;
    refetchTab?: () => Promise<QueryObserverResult<any, unknown>>;
}

export interface IMonthlyStatistic {
    _sum: {
        totalPrice?: number | null
        laundryPrice?: number
    };
};
