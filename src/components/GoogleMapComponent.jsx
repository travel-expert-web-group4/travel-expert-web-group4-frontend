import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 51.045,
  lng: -114.057,
};

const GoogleMapComponent = ({ agencies, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    if (!mapRef.current || !window.google || agencies.length === 0) return;

    // Clear previous markers
    mapRef.current.markers?.forEach((m) => m.setMap(null));
    mapRef.current.markers = [];

    agencies.forEach((agency) => {
      const marker = new google.maps.Marker({
        position: { lat: agency.lat, lng: agency.lng },
        map: mapRef.current,
        title: `Agency #${agency.id}`,
      });

      marker.addListener("click", () => {
        setActiveMarker(agency);
        onMarkerClick?.(agency.id);
      });

      mapRef.current.markers.push(marker);
    });
  }, [agencies, onMarkerClick]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={9}
      center={defaultCenter}
      onLoad={(map) => {
        mapRef.current = map;
        map.markers = [];
      }}
    >
      {activeMarker && (
        <InfoWindow
          position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
          onCloseClick={() => setActiveMarker(null)}
        >
          <div style={{ maxWidth: "200px" }}>
            <strong>Agency #{activeMarker.id}</strong><br />
            {activeMarker.agncyaddress}<br />
            {activeMarker.agncycity}, {activeMarker.agncyprov}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapComponent;
