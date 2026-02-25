import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png?url';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png?url';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png?url';

// Fix Leaflet's default icon paths issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
});

// A custom Red Icon using an SVG string via divIcon
const createCustomIcon = (sizeMultiplier) => {
    // Base size is 24, incrementing slightly based on volume
    const size = Math.min(48, 24 + (sizeMultiplier * 2));

    const svgHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CE1126" stroke="white" stroke-width="1.5" class="w-full h-full drop-shadow-md">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    `;

    return L.divIcon({
        className: 'custom-map-pin bg-transparent border-none',
        html: `<div style="width: ${size}px; height: ${size}px; transform: translate(-50%, -100%); mt-2">${svgHtml}</div>`,
        iconSize: [0, 0], // The offset is handled in the transform
        iconAnchor: [0, 0],
        popupAnchor: [0, -size]
    });
};

// Approximate coordinates for Lebanese regions
// Beirut, Mount Lebanon, North Lebanon, South Lebanon, Bekaa, Nabatieh
const regionCoordinates = {
    'Beirut': [33.8938, 35.5018],
    'Mount Lebanon': [33.7, 35.6167],
    'North Lebanon': [34.4333, 35.8333],
    'South Lebanon': [33.2733, 35.2033],
    'Bekaa': [33.8463, 35.9020],
    'Nabatieh': [33.3667, 35.4833]
};

const GeographicInsights = ({ data }) => {
    const regionCounts = useMemo(() => {
        if (!data || data.length === 0) return {};
        return data.reduce((acc, curr) => {
            const region = curr.region || 'Unknown';
            acc[region] = (acc[region] || 0) + 1;
            return acc;
        }, {});
    }, [data]);

    return (
        <div style={{ height: '100%', width: '100%', minHeight: '300px', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <MapContainer center={[33.8547, 35.8623]} zoom={8} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                {Object.entries(regionCounts).map(([region, count]) => {
                    const position = regionCoordinates[region];
                    // Scale factor for the icon based on citizen count
                    const scale = Math.sqrt(count);

                    if (position) {
                        return (
                            <Marker
                                key={region}
                                position={position}
                                icon={createCustomIcon(scale)}
                            >
                                <Tooltip direction="top" opacity={1}>
                                    <div className="text-center font-sans tracking-tight">
                                        <strong className="text-gray-900">{region}</strong><br />
                                        <span className="text-gray-600">{count} CITIZENS</span>
                                    </div>
                                </Tooltip>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

export default GeographicInsights;
