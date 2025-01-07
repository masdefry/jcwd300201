export type SelectedTab = 'today' | 'month';

export interface IDataOrderDriver {
    laundryPrice: number;
    totalOrders: number;
    totalWeight: number;
    totalPcs: number;
    totalSpent:number
}

export interface ITabTrackingProps {
    selectedTab: SelectedTab;
    setSelectedTab: (tab: SelectedTab) => void;
    dataOrder: IDataOrderDriver | null;
}
