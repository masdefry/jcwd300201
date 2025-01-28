import { useEffect, useMemo, useState } from "react";
import authStore from "@/zustand/authoStore";
import { locationStore } from "@/zustand/locationStore";
import { useRouter } from "next/navigation";
import L from 'leaflet'


export const useSetLocationHook = () => {
    const latitudeGlobal = locationStore((state) => state?.latitude);
    const lngGlobal = locationStore((state) => state?.longitude);
    const setLocation = locationStore((state) => state?.setLocationUser)
    const setIsPositionCheck = locationStore((state) => state?.setIsPositionCheck)
    const [pickLocationSuccess, setIsPickLocationSuccess] = useState<boolean>(false)
    const token = authStore((state) => state?.token)
    const [isPosition, setIsPosition] = useState({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 });
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const container: any = L?.DomUtil.get("map-container");
            if (container != null) {
                container._leaflet_id = null;
            }
        }
    }, [])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const container: any = L?.DomUtil.get("map-container-mobile");
            if (container != null) {
                container._leaflet_id = null;
            }
        }
    }, [])

    useEffect(() => {
        setIsPosition({ lat: latitudeGlobal || -6.200000, lng: lngGlobal || 106.816666 })
    }, [latitudeGlobal, lngGlobal])

    const time = useMemo(() => new Date().getTime(), [])

    return {
        time, token, latitudeGlobal, lngGlobal, setIsPositionCheck, setLocation,
        pickLocationSuccess, setIsPickLocationSuccess, isPosition, setIsPosition, router
    }
}