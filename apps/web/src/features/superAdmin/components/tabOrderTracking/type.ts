export type SelectedTab = 'today' | 'month';

export interface IDataOrder {
    laundryPrice: number;
    orderCount: number;
    totalKg: number;
    totalPcs: number;
}

export interface ITabTrackingProps {
    selectedTab: SelectedTab;
    setSelectedTab: (tab: SelectedTab) => void;
    dataOrder: IDataOrder | null;
}
