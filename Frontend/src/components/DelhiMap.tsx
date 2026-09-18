import {
  GoogleMap,
  Marker,

  useJsApiLoader,
} from "@react-google-maps/api";
import { useEffect, useState } from "react";

const DELHI_CENTER = {
  lat: 28.6139,
  lng: 77.2090,
};

const DELHI_BOUNDS = {
  north: 28.88,
  south: 28.40,
  east: 77.35,
  west: 76.84,
};

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "20px",
};

export default function DelhiMap() {
    const [complaints, setComplaints] = useState<any[]>([]);
      useEffect(() => {
    fetch("http://127.0.0.1:8000/complaints")
      .then((response) => response.json())
      .then((data) => {
        console.log("Complaints from backend:", data);
        setComplaints(data);
      })
      .catch((error) => {
        console.error("Error loading complaints:", error);
      });
  }, []);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) {
    return <div>Google Maps could not be loaded.</div>;
  }

  if (!isLoaded) {
    return <div>Loading Delhi map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={DELHI_CENTER}
      zoom={11}
      options={{
        restriction: {
          latLngBounds: DELHI_BOUNDS,
          strictBounds: true,
        },
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: true,
      }}
    >
      <Marker
        position={DELHI_CENTER}
        title="Delhi"
      />
            {complaints.map((complaint) =>
        complaint.latitude != null && complaint.longitude != null ? (
          <Marker
            key={complaint.complaint_id}
            position={{
              lat: complaint.latitude,
              lng: complaint.longitude,
            }}
            title={`${complaint.category} - ${complaint.description}`}
          />
        ) : null
      )}
    </GoogleMap>
  );
}