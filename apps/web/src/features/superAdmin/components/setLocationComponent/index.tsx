'use client'

import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import L from 'leaflet'

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const LocationPicker = dynamic(() => import('@/components/core/locationPicker'), { ssr: false })
// const L = dynamic(() => import('leaflet'))

export default function SetLocationComponent({ isPosition, setFieldValue, setIsPosition }: any) {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const container: any = L?.DomUtil.get("map-container");
            if (container != null) {
                container._leaflet_id = null;
            }
        }
    }, [])

    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const container: any = L?.DomUtil.get("map-container-mobile");
    //         if (container != null) {
    //             container._leaflet_id = null;
    //         }
    //     }
    // }, [])

    const time = useMemo(() => new Date().getTime(), [])

    return (
        <MapContainer id="map-container" key={time} center={isPosition} zoom={13} className="w-full h-full rounded-2xl">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker setFieldValue={setFieldValue} position={isPosition} setPosition={setIsPosition} />
        </MapContainer>
    );
}