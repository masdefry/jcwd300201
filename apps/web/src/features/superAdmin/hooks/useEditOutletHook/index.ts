import { locationStore } from "@/zustand/locationStore";
import { instance } from "@/utils/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, use, useState } from "react";
import authStore from "@/zustand/authoStore";
import { toast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";

export const useEditOutletHook = ({ params }: { params: Promise<{ detail: string }> }) => {
    const { detail } = use(params)
    const token = authStore((state) => state?.token)
    const [selectedProvince, setSelectedProvince] = useState<string>('')

    const latitudeGlobal = locationStore((state) => state?.latitude);
    const lngGlobal = locationStore((state) => state?.longitude);
    const isPositionCheck = locationStore((state) => state?.checkAddressOutlet)
    const setIsPositionCheck = locationStore((state) => state?.setIsPositionCheck)
    const [isPosition, setIsPosition] = useState({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 });
    const [isDisabledSucces, setIsDisabledSucces] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        setIsPosition({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 })
    }, [latitudeGlobal, lngGlobal])

    const { data: dataOutlet, isFetching } = useQuery({
        queryKey: ['get-data'],
        queryFn: async () => {
            const res = await instance.get(`/store/detail/${detail}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return res?.data?.data
        }
    })

    const { data: cities, isLoading: citiesLoading, isFetching: loadingPage } = useQuery({
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

    const { mutate: handleUpdateOutlet, isPending } = useMutation({
        mutationFn: async ({ storeName, address, city, province, zipCode, latitude, longitude }: any) => {
            return await instance.patch(`/store/detail/${detail}`, {
                storeName, address, city, province, zipCode, latitude, longitude
            }, { headers: { Authorization: `Bearer ${token}` } })
        },
        onSuccess: (res) => {
            toast({
                description: res?.data?.message,
                className: "bg-blue-500 text-white p-4 rounded-lg shadow-lg"
            })

            setIsPositionCheck(false)
            setIsDisabledSucces(true)
            router.push('/admin/outlet/')
        },
        onError: (err: { response: { data: { message: string } } }) => {
            toast({
                description: err?.response?.data?.message,
                className: "bg-red-500 text-white p-4 rounded-lg shadow-lg"
            })
        }
    })


    return {
        router, isDisabledSucces, dataOutlet, isFetching, loadingPage, handleUpdateOutlet, lngGlobal, token, isPosition, setIsPosition, selectedProvince, setSelectedProvince,
        cities, isPositionCheck, citiesLoading, provinces, provincesLoading, isPending,
    }

}
