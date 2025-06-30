import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Star } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  styles: [
    {
      featureType: "poi.medical",
      stylers: [{ visibility: "simplified" }],
    },
  ],
};

const MapComponent = ({
  userLocation,
  hospitals,
  selectedHospital,
  onHospitalSelect,
}) => {
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);

  const userIcon = {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" fill="#5AC8FA" stroke="white" stroke-width="4"/>
          <circle cx="16" cy="16" r="4" fill="white"/>
        </svg>
      `),
    scaledSize: { width: 32, height: 32 },
  };

  const hospitalIcon = (isActive = false) => ({
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2L37 37H3L20 2Z" fill="${isActive ? "#5AC8FA" : "#EF4444"}" stroke="white" stroke-width="2"/>
          <rect x="17" y="12" width="6" height="2" fill="white"/>
          <rect x="19" y="10" width="2" height="6" fill="white"/>
        </svg>
      `),
    scaledSize: { width: 40, height: 40 },
  });

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation}
        zoom={12}
        options={mapOptions}
      >
        <Marker position={userLocation} icon={userIcon} title="You" />

        {hospitals.map((hospital) => (
          <Marker
            key={hospital.place_id}
            position={{ lat: hospital.lat, lng: hospital.lng }}
            icon={hospitalIcon(
              selectedHospital?.place_id === hospital.place_id
            )}
            onClick={() => {
              onHospitalSelect(hospital);
              setActiveInfoWindow(hospital.place_id);
            }}
          />
        ))}

        {activeInfoWindow && (
          <InfoWindow
            position={{
              lat: hospitals.find((h) => h.place_id === activeInfoWindow)?.lat,
              lng: hospitals.find((h) => h.place_id === activeInfoWindow)?.lng,
            }}
            onCloseClick={() => setActiveInfoWindow(null)}
          >
            <div className="p-2 max-w-xs">
              {(() => {
                const h = hospitals.find(
                  (h) => h.place_id === activeInfoWindow
                );
                return (
                  <>
                    <h3 className="font-semibold text-gray-900">{h.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {h.rating || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600">{h.vicinity}</div>
                  </>
                );
              })()}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;