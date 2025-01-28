import { locationStore } from "@/zustand/locationStore";
import { instance } from "@/utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import L from 'leaflet'
import authStore from "@/zustand/authoStore";
import { toast } from "@/components/hooks/use-toast";

export const useCreateOutletHook = () => {
    const latitudeGlobal = locationStore((state) => state?.latitude);
    const lngGlobal = locationStore((state) => state?.longitude);
    const token = authStore((state) => state?.token)
    const [isPosition, setIsPosition] = useState({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 });
    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [dataUser, setDataUser] = useState<any>({})
    const { data: cities, isLoading: citiesLoading } = useQuery({
        queryKey: ['get-city', selectedProvince],
        queryFn: async () => {
            const res = await instance.get('/order/city', { params: { province_id: selectedProvince } });
            return res?.data?.data?.rajaongkir?.results;
        },
        enabled: !!selectedProvince,
    })

    const { data: provinces, isLoading: provincesLoading } = useQuery({
        queryKey: ['get-province'],
        queryFn: async () => {
            const res = await instance.get('/order/province');
            return res?.data?.data?.rajaongkir?.results
        },
    })

    const { mutate: handleSubmitAddStore, isPending } = useMutation({
        mutationFn: async ({ storeName, address, city, province, zipCode, latitude, longitude }: any) => {
            return await instance.post('/store', {
                storeName, address, city, province, zipCode, latitude, longitude,
            },
                { headers: { Authorization: `Bearer ${token}` } })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })

    useEffect(() => {
        setIsPosition({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 })
    }, [latitudeGlobal, lngGlobal])

    useEffect(() => {
        const getLocation = async (): Promise<void> => {
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${isPosition?.lat?.toString()}&lon=${isPosition?.lng?.toString()}&format=json`)
                setDataUser(response?.data)
    
            } catch (error) {}
        }
        
        if (isPosition.lat && isPosition.lng) {
            getLocation();
        }
    }, [isPosition]);

    useEffect(() => {
        return () => {
            const container: any = L?.DomUtil.get("map-container");
            if (container != null) {
                container._leaflet_id = null;
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            const container: any = L?.DomUtil.get("map-container-mobile");
            if (container != null) {
                container._leaflet_id = null;
            }
        };
    }, []);

    const time = useMemo(() => new Date().getTime(), [])


    return {
        lngGlobal, token, isPosition, setIsPosition, selectedProvince, setSelectedProvince, dataUser, setDataUser,
        time, cities, citiesLoading, provinces, provincesLoading, handleSubmitAddStore, isPending,
    }

}
