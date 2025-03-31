import React, { useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 51.045,
  lng: -114.057,
};

const GoogleMapComponent = ({ agencies, onMarkerClick }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const markerClustererRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.google || agencies.length === 0) return;

    // Remove existing cluster if any
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }

    // Create markers
    const markers = agencies.map((agency) => {
      const marker = new window.google.maps.Marker({
        position: { lat: agency.lat, lng: agency.lng },
        title: `Agency #${agency.id}`,
      });

      marker.addListener("click", () => {
        setActiveMarker(agency);
        onMarkerClick?.(agency.id);
      });

      return marker;
    });

    // Initialize clusterer
    markerClustererRef.current = new MarkerClusterer({
      markers,
      map: mapRef.current,
    });
  }, [agencies, onMarkerClick]);

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={9}
      center={defaultCenter}
      onLoad={(map) => (mapRef.current = map)}
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
