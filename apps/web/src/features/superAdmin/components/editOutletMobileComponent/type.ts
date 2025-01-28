import { useRouter } from "next/navigation";

export interface IEditOutletMobile {
    isPosition: { lat: number; lng: number };
    provinces: { province_id: string; province: string }[];
    cities: { city_id: string; city_name: string }[];
    provincesLoading: boolean;
    citiesLoading: boolean;
    dataOutlet: {
        storeName: string;
        address: string;
        zipCode: string;
        latitude: number;
        longitude: number;
    };
    setSelectedProvince: React.Dispatch<React.SetStateAction<string>>;
    isPositionCheck: boolean;
    selectedProvince: string;
    isDisabledSucces: boolean;
    isPending: boolean;
    router: ReturnType<typeof useRouter>;
    handleUpdateOutlet: (values: {
        storeName: string;
        address: string;
        province: string;
        city: string;
        zipCode: string;
        latitude: string;
        longitude: string;
    }) => void;
}

