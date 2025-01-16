export interface ICreateOutletWeb {
    isPosition: { lat: number; lng: number };
    provinces: { province_id: string; province: string }[]; 
    cities: { city_id: string; city_name: string }[];
    provincesLoading: boolean;
    citiesLoading: boolean;
    handleSubmitAddStore: any
    setSelectedProvince: React.Dispatch<React.SetStateAction<string>>;
    time: number;
    selectedProvince: string | null
    setIsPosition: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>; 
    isPending: boolean; 
}

