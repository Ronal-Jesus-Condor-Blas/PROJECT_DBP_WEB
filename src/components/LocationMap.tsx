import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono personalizado
const customIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationMapProps {
    initialPosition: { lat: number; lng: number };
    onLocationChange: (lat: number, lng: number) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ initialPosition, onLocationChange }) => {
    const mapRef = useRef<L.Map | null>(null);

    const LocationMarker = () => {
        useMapEvents({
            click: (e) => {
                onLocationChange(e.latlng.lat, e.latlng.lng);
            },
        });

        return <Marker position={[initialPosition.lat, initialPosition.lng]} icon={customIcon} />;
    };

    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.setView([initialPosition.lat, initialPosition.lng], mapRef.current.getZoom());
        }
    }, [initialPosition]);

    return (
        <MapContainer
            center={[initialPosition.lat, initialPosition.lng]}
            zoom={15}
            style={{ height: '300px', borderRadius: '8px' }}
            ref={(mapInstance) => {
                if (mapInstance) {
                    mapRef.current = mapInstance;
                }
            }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
        </MapContainer>
    );
};

export default LocationMap;
