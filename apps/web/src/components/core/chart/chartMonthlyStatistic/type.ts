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
    isPending?: boolean;
}
