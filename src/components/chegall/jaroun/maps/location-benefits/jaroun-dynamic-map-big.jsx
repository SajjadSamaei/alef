"use client"; // Ensures this component runs on the client
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl"; // 1. Import the hook

// --- (Icon definitions remain the same) ---
const JarounPin = L.icon({
  iconUrl: "/icons/jaroun-pin.png", // Path to your custom pin in the public directory
  iconSize: [70, 70], // [width, height] of the icon in pixels
  iconAnchor: [35, 65.625], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  // shadowUrl: "/icons/shadow-pin.png", // Optional shadow image
  // shadowSize: [20, 20], // [width, height] of the shadow
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

const HospitalIcon = L.icon({
  iconUrl: "/icons/hospital-pin.png", // Path to your custom pin in the public directory
  iconSize: [45, 45], // [width, height] of the icon in pixels
  iconAnchor: [22.5, 42.187], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  // shadowUrl: "/icons/custom-shadow.png", // Optional shadow image
  shadowSize: [50, 64], // [width, height] of the shadow
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

const SeaIcon = L.icon({
  iconUrl: "/icons/sea-pin.png", // Path to your custom pin in the public directory
  iconSize: [45, 45], // [width, height] of the icon in pixels
  iconAnchor: [22.5, 42.187], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  // shadowUrl: "/icons/custom-shadow.png", // Optional shadow image
  shadowSize: [50, 64], // [width, height] of the shadow
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

const ParkIcon = L.icon({
  iconUrl: "/icons/park-pin.png", // Path to your custom pin in the public directory
  iconSize: [45, 45], // [width, height] of the icon in pixels
  iconAnchor: [22.5, 42.187], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  // shadowUrl: "/icons/custom-shadow.png", // Optional shadow image
  shadowSize: [50, 64], // [width, height] of the shadow
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

const MallIcon = L.icon({
  iconUrl: "/icons/mall-pin.png", // Path to your custom pin in the public directory
  iconSize: [45, 45], // [width, height] of the icon in pixels
  iconAnchor: [22.5, 42.187], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  // shadowUrl: "/icons/custom-shadow.png", // Optional shadow image
  shadowSize: [50, 64], // [width, height] of the shadow
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

const ShcoolIcon = L.icon({
  iconUrl: "/icons/school-pin.png", // Path to your custom pin in the public directory
  iconSize: [45, 45], // [width, height] of the icon in pixels
  iconAnchor: [22.5, 42.187], // Point of the icon that corresponds to the marker's location
  popupAnchor: [0, -50], // Point where the popup should open relative to the iconAnchor
  // shadowUrl: "/icons/custom-shadow.png", // Optional shadow image
  shadowSize: [50, 64], // [width, height] of the shadow
  shadowAnchor: [4, 62], // Point of the shadow that corresponds to the marker's location
});

export default function JarounBigMap() {
  const t = useTranslations("Project.Jaroun.Map"); // 2. Get translations
  const mapRef = (useRef < L.Map) | (null > null); // 3. Type the ref

  useEffect(() => {
    const mapInstance = mapRef.current; // 4. Fix: Get map instance from ref

    if (mapInstance) {
      // Initially disable drag and zoom interactions
      mapInstance.dragging.disable();
      mapInstance.scrollWheelZoom.disable();
      mapInstance.doubleClickZoom.disable();
      mapInstance.touchZoom.disable();

      const enableMapInteraction = () => {
        mapInstance.dragging.enable();
        mapInstance.scrollWheelZoom.enable();
        mapInstance.doubleClickZoom.enable();
        mapInstance.touchZoom.enable();
      };

      const disableMapInteraction = () => {
        mapInstance.dragging.disable();
        mapInstance.scrollWheelZoom.disable();
        mapInstance.doubleClickZoom.disable();
        mapInstance.touchZoom.disable();
      };

      const container = mapInstance.getContainer();

      // Add event listeners
      container.addEventListener("mouseenter", enableMapInteraction);
      container.addEventListener("mouseleave", disableMapInteraction);
      container.addEventListener("touchstart", enableMapInteraction);
      container.addEventListener("touchend", disableMapInteraction);

      return () => {
        // Cleanup event listeners
        container.removeEventListener("mouseenter", enableMapInteraction);
        container.removeEventListener("mouseleave", disableMapInteraction);
        container.removeEventListener("touchstart", enableMapInteraction);
        container.removeEventListener("touchend", disableMapInteraction);
      };
    }
  }, []);

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
        key="jaroun-local-map"
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
        center={[27.185408, 56.302544]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
        />

        {/* 6. Use localized text in Popups */}
        <Marker position={[27.185408, 56.302544]} icon={JarounPin}>
          <Popup>{t("jarounBuilding")}</Popup>
        </Marker>
        <Marker position={[27.193763, 56.297207]} icon={HospitalIcon}>
          <Popup>{t("hospital")}</Popup>
        </Marker>
        <Marker position={[27.18016, 56.29933]} icon={SeaIcon}>
          <Popup>{t("halfCircle")}</Popup>
        </Marker>
        <Marker position={[27.18815, 56.30259]} icon={ParkIcon}>
          <Popup>{t("park")}</Popup>
        </Marker>
        <Marker position={[27.186238, 56.29718]} icon={MallIcon}>
          <Popup>{t("mall")}</Popup>
        </Marker>
        <Marker position={[27.186587, 56.302271]} icon={ShcoolIcon}>
          <Popup>{t("narjesSchool")}</Popup>
        </Marker>
        <Marker position={[27.186367, 56.301649]} icon={ShcoolIcon}>
          <Popup>{t("gorjiSchool")}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
