import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
  LayersControl,
} from "react-leaflet";
import L from "leaflet";
import { useIssues } from "../state/IssuesContext.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UNSIGNED_PRESET } from "../config";

const containerStyle = { width: "100%", height: "420px" };

export default function ReportIssue() {
  const { addIssue } = useIssues();
  const { user } = useAuth(); // Get the current user
  const [center, setCenter] = useState({ lat: 22.3511148, lng: 78.6677428 });
  const [marker, setMarker] = useState(null);
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [currentLoc, setCurrentLoc] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef(null);
  const debounceRef = useRef(null);

  const reverseGeocodeWithGoogle = useCallback(async (lat, lng) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      const addr = data?.results?.[0]?.formatted_address;
      if (addr) setSelectedLabel(addr);
    } catch (_) {
      // ignore errors
    }
  }, []);

  const useMyLocation = useCallback(async () => {
    setErrorMsg("");
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported in this browser.");
      return;
    }
    try {
      setIsLocating(true);
      const isSecure =
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost";
      if (!isSecure) {
        setErrorMsg(
          "Location requires HTTPS or localhost. Please use localhost or enable HTTPS."
        );
      }
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentLoc({
            lat: coords.lat,
            lng: coords.lng,
            accuracy: pos.coords.accuracy || 0,
          });
          setCenter(coords);
          setMarker(coords);
          mapRef.current?.setView([coords.lat, coords.lng], 14);
          setShowInfo(true);
          reverseGeocodeWithGoogle(coords.lat, coords.lng);
          setIsLocating(false);
        },
        (err) => {
          setIsLocating(false);
          if (err.code === 1)
            setErrorMsg("Permission denied. Please allow location access.");
          else if (err.code === 2)
            setErrorMsg("Position unavailable. Check GPS or network.");
          else if (err.code === 3) setErrorMsg("Location timeout. Try again.");
          else setErrorMsg("Unable to fetch your location.");
        },
        options
      );
    } catch (_) {
      setIsLocating(false);
      setErrorMsg("Unable to fetch your location.");
    }
  }, [reverseGeocodeWithGoogle]);

  // India geographic bounds
  const indiaBounds = useMemo(
    () =>
      L.latLngBounds(
        L.latLng(6.4626999, 68.1097),
        L.latLng(35.513327, 97.395358)
      ),
    []
  );

  function ClickHandler() {
    useMapEvents({
      click(e) {
        const position = { lat: e.latlng.lat, lng: e.latlng.lng };
        setMarker(position);
        setShowInfo(true);
        reverseGeocodeWithGoogle(position.lat, position.lng);
      },
    });
    return null;
  }

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!user) {
        setErrorMsg("You must be signed in to submit a report.");
        return;
      }
      if (!marker || !title.trim() || !description.trim() || !location.trim()) return;

      // Upload images to Cloudinary (if any files selected)
      const cloudName = CLOUDINARY_CLOUD_NAME;
      const uploadPreset = CLOUDINARY_UNSIGNED_PRESET;
      let uploadedUrls = [];
      try {
        if (images.length > 0) {
          if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary not configured. Set REACT_APP_CLOUDINARY_* env vars.");
          }
          const uploads = images.map(async (file) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", uploadPreset);
            const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
              method: "POST",
              body: formData,
            });
            if (!res.ok) throw new Error("Image upload failed");
            const data = await res.json();
            return data.secure_url || data.url;
          });
          uploadedUrls = await Promise.all(uploads);
        }
      } catch (err) {
        setErrorMsg("Image upload failed. Please try again.");
        return;
      }

      const newIssue = {
        title: title.trim(),
        location: marker,
        description: description.trim(),
        imageUrls: uploadedUrls,
        locationDetails: location.trim(),
        addressLabel: selectedLabel || null,
        mapZoom: mapRef.current ? mapRef.current.getZoom() : null,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      };
      try {
        await addDoc(collection(db, "issues"), newIssue);
        setTitle("");
        setDescription("");
        setImages([]);
        setLocation("");
        setShowInfo(false);
        setErrorMsg("Issue reported successfully!");
      } catch (error) {
        setErrorMsg("Failed to report the issue. Please try again.");
      }
    },
    [marker, description, location, images, user]
  );

  return (
    <section className="stack gap-lg">
      <h1 className="title">Report Issue</h1>
      {errorMsg && <p className="error">{errorMsg}</p>}
      <div className="stack gap-md">
        <div className="row gap-sm" style={{ position: "relative" }}>
          <div className="autocomplete" style={{ width: "100%" }}>
            <input
              className="input"
              value={query}
              onFocus={() => suggestions.length && setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              placeholder="Search places in India"
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                setErrorMsg("");
                if (debounceRef.current) clearTimeout(debounceRef.current);
                if (!v.trim()) {
                  setSuggestions([]);
                  setShowDropdown(false);
                  return;
                }
                debounceRef.current = setTimeout(async () => {
                  try {
                    setIsSearching(true);
                    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=6&countrycodes=in&q=${encodeURIComponent(
                      v
                    )}`;
                    const res = await fetch(url, {
                      headers: { Accept: "application/json" },
                    });
                    if (!res.ok) throw new Error("Search failed");
                    const data = await res.json();
                    setSuggestions(Array.isArray(data) ? data : []);
                    setShowDropdown(true);
                  } catch (err) {
                    setSuggestions([]);
                    setErrorMsg("Search error. Please try again.");
                  } finally {
                    setIsSearching(false);
                  }
                }, 300);
              }}
            />
            {showDropdown && suggestions.length > 0 && (
              <div className="dropdown">
                {suggestions.map((s) => {
                  const loc = {
                    lat: parseFloat(s.lat),
                    lng: parseFloat(s.lon),
                  };
                  return (
                    <button
                      type="button"
                      key={`${s.place_id}`}
                      className="dropdown-item"
                      onMouseDown={() => {
                        setQuery(s.display_name);
                        setSelectedLabel(s.display_name);
                        setCenter(loc);
                        setMarker(loc);
                        mapRef.current?.setView([loc.lat, loc.lng], 15);
                        setShowInfo(true);
                        setShowDropdown(false);
                      }}
                    >
                      {s.display_name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn"
            onClick={useMyLocation}
            disabled={isSearching || isLocating}
          >
            {isLocating ? "Locating..." : "Use My Location"}
          </button>
        </div>

        {/* ✅ Fixed address block */}
        {selectedLabel && (
          <div
            style={{
              margin: "10px 0",
              padding: "8px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#f9fafb",
              fontSize: "0.9rem",
              color: "#374151",
            }}
          >
            📍 {selectedLabel}
          </div>
        )}

        <div style={containerStyle}>
          <MapContainer
            center={[22.3511148, 78.6677428]}
            zoom={5}
            minZoom={4}
            maxZoom={18}
            maxBounds={indiaBounds}
            maxBoundsViscosity={1.0}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: "12px",
              position: "relative",
            }}
            whenCreated={(map) => {
              mapRef.current = map;
              map.fitBounds(indiaBounds, { padding: [20, 20] });
            }}
          >
            <LayersControl position="topright">
              <LayersControl.BaseLayer name="Map View">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Satellite View">
                <TileLayer
                  url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  attribution="&copy; Google"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer checked name="Street View">
                <TileLayer
                  url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                  subdomains={["mt0", "mt1", "mt2", "mt3"]}
                  attribution="&copy; Google"
                />
              </LayersControl.BaseLayer>
            </LayersControl>
            <ClickHandler />
            {currentLoc && (
              <>
                <Marker
                  position={[currentLoc.lat, currentLoc.lng]}
                  icon={L.divIcon({
                    className: "current-dot",
                    html: '<div style="width:12px;height:12px;background:#2563eb;border:2px solid #fff;border-radius:9999px;box-shadow:0 0 0 2px rgba(37,99,235,0.3)"></div>',
                  })}
                />
                {currentLoc.accuracy > 0 && (
                  <Circle
                    center={[currentLoc.lat, currentLoc.lng]}
                    radius={currentLoc.accuracy}
                    pathOptions={{
                      color: "#2563eb",
                      fillColor: "#93c5fd",
                      fillOpacity: 0.2,
                      weight: 1,
                    }}
                  />
                )}
              </>
            )}
            {marker && (
              <Marker
                position={[marker.lat, marker.lng]}
                icon={L.icon({
                  iconUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })}
              >
                {showInfo && (
                  <Popup>
                    <div style={{ maxWidth: 260 }}>
                      {selectedLabel && (
                        <div
                          style={{ fontWeight: 600, marginBottom: 6 }}
                        >
                          {selectedLabel}
                        </div>
                      )}
                      {images.length > 0 && (
                        <Slider
                          dots
                          infinite
                          speed={500}
                          slidesToShow={1}
                          slidesToScroll={1}
                        >
                          {images.map((img, index) => (
                            <div key={index}>
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${index}`}
                                style={{
                                  width: "100%",
                                  borderRadius: 8,
                                  border: "1px solid #eee",
                                  marginBottom: 6,
                                }}
                              />
                            </div>
                          ))}
                        </Slider>
                      )}
                      <div
                        style={{
                          fontSize: 12,
                          marginBottom: 6,
                        }}
                      >
                        {description || "Add a description below"}
                      </div>
                      {location && (
                        <div
                          style={{
                            fontSize: 12,
                            fontStyle: "italic",
                          }}
                        >
                          Location: {location}
                        </div>
                      )}
                    </div>
                  </Popup>
                )}
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      <form className="form stack gap-md" onSubmit={submit}>
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a brief title"
            required
          />
        </label>
        <label className="field">
          <span>Images (up to 3)</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files).slice(0, 3);
              setImages(files);
            }}
          />
        </label>
        <label className="field">
          <span>Location</span>
          <textarea
            rows="4"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Describe the Location..."
            required
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            required
          />
        </label>
        <button
          className="btn primary"
          type="submit"
          disabled={!marker || !title.trim() || !description.trim()}
        >
          Submit Report
        </button>
      </form>
    </section>
  );
}
