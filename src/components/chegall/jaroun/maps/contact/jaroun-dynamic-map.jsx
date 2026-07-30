"use client"; // Ensures this component runs on the client
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl"; // 1. Import the hook

const CustomPinIcon = L.icon({
  iconUrl: "/icons/jaroun-pin.png", // Path to your custom pin in the public directory
  iconSize: [70, 70], // [width, height] of the icon in pixels
  iconAnchor: [35, 65.625], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

export default function JarounMap() {
  const t = useTranslations("Project.Jaroun.Map"); // 2. Get translations
  const mapRef = (useRef < L.Map) | (null > null); // 3. Type the ref

  useEffect(() => {
    // Cleanup function to remove the map instance when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        key="jaroun-local-map-2"
        ref={mapRef} // 4. Add the ref to the container
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
        center={[27.185408, 56.302544]} // Initial coordinates
        zoom={17} // Initial zoom level
        style={{ height: "100%", width: "100%" }} // Map will fill its container
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
        />

        <Marker position={[27.185408, 56.302544]} icon={CustomPinIcon}>
          <Popup>{t("jarounBuilding")}</Popup> {/* 5. Use translated text */}
        </Marker>
      </MapContainer>
    </div>
  );
}
