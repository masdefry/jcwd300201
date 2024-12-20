'use client'

import { useEffect } from "react";
import { Marker, useMapEvents } from "react-leaflet";
import L from 'leaflet'
import { IPosition } from "@/app/(user)/user/dashboard/settings/address/c/types";

const customMarkerIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function LocationPicker({ setFieldValue, position, setPosition, }: { setFieldValue: any; position: IPosition; setPosition: React.Dispatch<React.SetStateAction<IPosition>> }) {
    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setFieldValue("latitude", lat);
            setFieldValue("longitude", lng);
            setPosition({ lat, lng });
        },
    });

    useEffect(() => {
        if (map && position) {
            map.setView(position, map.getZoom());
        }

    }, [position, map])

    return position ? (
        <Marker
            position={position}
            icon={customMarkerIcon}
            draggable={true}
            eventHandlers={{
                dragend(e) {
                    const lat = e.target.getLatLng().lat;
                    const lng = e.target.getLatLng().lng;
                    setFieldValue("latitude", lat);
                    setFieldValue("longitude", lng);
                    setPosition({ lat, lng });
                },
            }}
        />
    ) : null;
}