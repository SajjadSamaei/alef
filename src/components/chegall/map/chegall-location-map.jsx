"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Create custom Icon
const JarounPin = L.icon({
  iconUrl: "/icons/project-pin.png",
  iconSize: [70, 70],
  iconAnchor: [35, 65.625],
  popupAnchor: [0, -50],
  shadowAnchor: [4, 62],
});

export default function ChegallDynamicMap() {
  return (
    <div className="relative z-0 h-full w-full">
      <MapContainer
        key="chegall-location"
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
        center={[27.210554, 56.349029]}
        zoom={16}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=L08U5uVrnpgrrz3g8Cqgjvl1hkHnaP7qQnPUYQTk2g5pXCX6t9gJlx5gGYbal5S0"
          attribution='&copy; <a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a> contributors'
        />

        <Marker position={[27.210554, 56.349029]} icon={JarounPin}>
          <Popup className="font-sans text-sm"> دفتر معماری الف </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
