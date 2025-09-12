import { useMemo, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { useIssues } from '../state/IssuesContext.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const containerStyle = { width: '100%', height: 'calc(100vh - 150px)' };

// Custom icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LiveMap() {
  const [issues, setIssues] = useState([]);
  const { toggleIssueResolved } = useIssues();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "issues"), (snapshot) => {
      const liveIssues = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setIssues(liveIssues);
    });

    return () => unsubscribe();
  }, []);

  const center = useMemo(() => {
    if (issues.length) return issues[0].location;
    return { lat: 22.3511148, lng: 78.6677428 };
  }, [issues]);

  return (
    <section className="stack gap-lg">
      <h1 className="title">Live Issues Map</h1>
      <div style={containerStyle}>
        <MapContainer
          center={center}
          zoom={5}
          minZoom={4}
          maxZoom={18}
          style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Map View">
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
          </LayersControl>

          {issues
            .filter((i) => i?.location && Number.isFinite(i.location.lat) && Number.isFinite(i.location.lng))
            .map((issue) => (
              <Marker
                key={`${issue.id}-${issue.resolved ? 'resolved' : 'open'}`}
                position={[issue.location.lat, issue.location.lng]}
                icon={issue.resolved ? greenIcon : redIcon}
              >
                <Popup>
                  <div style={{ maxWidth: 280 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        {issue.title || 'Reported Issue'}
                      </div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>
                        {issue.createdAt ? new Date(issue.createdAt).toLocaleString() : ''}
                      </div>
                    </div>
                    {Array.isArray(issue.imageUrls) && issue.imageUrls.length > 0 && (
                      <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
                        {issue.imageUrls.map((img, index) => (
                          <div key={index}>
                            <img
                              src={img}
                              alt={`issue-${index}`}
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x300?text=Image+unavailable'; }}
                              style={{ width: '100%', borderRadius: 8, border: '1px solid #eee', marginBottom: 6 }}
                            />
                          </div>
                        ))}
                      </Slider>
                    )}
                    {(issue.addressLabel || issue.locationDetails) && (
                      <div style={{ fontSize: 12, fontStyle: 'italic', marginBottom: 6 }}>
                        Location: {issue.addressLabel || issue.locationDetails}
                      </div>
                    )}
                    {issue.description && (
                      <div style={{ fontSize: 12 }}>
                        {issue.description}
                      </div>
                    )}
                    {user && isAdmin && (
                      <button
                        onClick={async () => {
                          try {
                            await updateDoc(doc(db, 'issues', issue.id), {
                              resolved: !issue.resolved,
                              resolvedAt: new Date().toISOString(),
                              resolvedBy: user.uid,
                            });
                          } catch (_) {
                            // no-op UI; could add toast
                          }
                        }}
                        style={{ marginTop: 10, width: '100%' }}
                      >
                        {issue.resolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </section>
  );
}