"use client"; // Ensures this component runs on the client
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

const JarounPin = L.icon({
  iconUrl: "/icons/project-pin.png", // Path to your custom pin in the public directory
  iconSize: [70, 70], // [width, height] of the icon in pixels
  iconAnchor: [35, 65.625], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

export default function ProjectDynamicMap({ latitude, longitude }) {
  // const initialZoom = window.innerWidth < 768 ? 14 : 15;
  const mapRef = useRef(null);
  const tCaseStudy = useTranslations("CaseStudy");
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
        key="project-location"
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
        center={[Number(latitude), Number(longitude)]} // Initial coordinates
        zoom={16} // Initial zoom level
        style={{ height: "100%", width: "100%", backgroundColor: "#343332" }} // Map will fill its container
      >
        <TileLayer
          url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=L08U5uVrnpgrrz3g8Cqgjvl1hkHnaP7qQnPUYQTk2g5pXCX6t9gJlx5gGYbal5S0"
          attribution='&copy; <a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a> contributors'
        />

        <Marker
          position={[Number(latitude), Number(longitude)]}
          icon={JarounPin}
        >
          <Popup>{tCaseStudy("projectLocation")}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
