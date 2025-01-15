interface IconItem {
    icon: JSX.Element;  
    url: string;        
    name: string;       
}


export interface IconMenuDashboardMobileProps {
    arrIcon: IconItem[]; 
    cols:string
}
