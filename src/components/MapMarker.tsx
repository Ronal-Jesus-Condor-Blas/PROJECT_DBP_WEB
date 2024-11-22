import React from "react";

interface MarkerProps {
    lat: number;
    lng: number;
    name: string;
}

const MapMarker: React.FC<MarkerProps> = ({ name }) => {
    return (
        <div
            style={{
                color: "red",
                background: "white",
                padding: "5px",
                borderRadius: "50%",
                textAlign: "center",
            }}
        >
            {name}
        </div>
    );
};

export default MapMarker;