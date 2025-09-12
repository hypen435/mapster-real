 import { useMemo, useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { useIssues } from '../state/IssuesContext.jsx';
import { useAuth } from '../state/AuthContext.jsx';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './viewIssues.css';
import { useTranslation } from 'react-i18next';
import { collection, onSnapshot, query, where, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

const containerStyle = { width: '100%', height: '520px' };

export default function ViewIssues() {
  const { t } = useTranslation();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth(); // Get the current user
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    // Require sign-in for viewing user's issues
    if (!user) {
      setIssues([]);
      setLoading(false);
      return undefined;
    }
    try {
      const q = query(
        collection(db, "issues"),
        where("userId", "==", user.uid)
      );
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const fetched = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
          setIssues(fetched);
          setLoading(false);
        },
        (err) => {
          setError("Failed to load issues.");
          setLoading(false);
          // eslint-disable-next-line no-console
          console.error("Error fetching issues:", err);
        }
      );
      return () => unsub();
    } catch (err) {
      setError("Failed to load issues.");
      setLoading(false);
      return undefined;
    }
  }, [user]);

  const userIssues = issues;

  const [activeId, setActiveId] = useState(null);
  const mapRef = useRef(null);

  const center = useMemo(() => {
    if (issues.length) return issues[0].location;
    return { lat: 22.3511148, lng: 78.6677428 };
  }, [issues]);

  const indiaBounds = useMemo(() => L.latLngBounds(
    L.latLng(6.4626999, 68.1097),
    L.latLng(35.513327, 97.395358)
  ), []);

  

  return (
    <section className="stack gap-lg">
      <h1 className="title">{t('my_reported_issues')}</h1>
      {authLoading ? (
        <p>{t('loading') || 'Loading...'}</p>
      ) : !user ? (
        <p>Please sign in to view your reported issues.</p>
      ) : loading ? (
        <p>{t('loading') || 'Loading...'}</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : userIssues.length === 0 ? (
        <p>{t('no_issues_reported')}</p>
      ) : (
        <div className="stack gap-md">
          {userIssues.map((issue) => (
            <div key={issue.id} className="issue-card">
              <div className="issue-card__header">
                <h2 className="issue-card__title">{issue.title || t('untitled_issue')}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <span className="issue-card__date">{new Date(issue.createdAt).toLocaleString()}</span>
                  <button
                    type="button"
                    className="btn btn--danger"
                    disabled={!!deletingId}
                    onClick={async () => {
                      if (!window.confirm('Delete this report permanently?')) return;
                      try {
                        setDeletingId(issue.id);
                        await deleteDoc(doc(db, 'issues', issue.id));
                      } catch (_) {
                        // eslint-disable-next-line no-alert
                        alert('Failed to delete. Please try again.');
                      } finally {
                        setDeletingId("");
                      }
                    }}
                  >
                    {deletingId === issue.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>

              <div className="issue-card__images">
                {Array.isArray(issue.imageUrls) && issue.imageUrls.length > 1 ? (
                  <Slider dots infinite speed={500} slidesToShow={1} slidesToScroll={1}>
                    {issue.imageUrls.map((url, idx) => (
                      <div key={idx}>
                        <img
                          src={url}
                          alt={t('issue_image')}
                          referrerPolicy="no-referrer"
                          className="issue-card__image"
                          onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Image+unavailable'; }}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : Array.isArray(issue.imageUrls) && issue.imageUrls.length === 1 ? (
                  <img
                    src={issue.imageUrls[0]}
                    alt={t('issue_image')}
                    referrerPolicy="no-referrer"
                    className="issue-card__image"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Image+unavailable'; }}
                  />
                ) : (
                  <div className="issue-card__map--empty"><span>No image</span></div>
                )}
              </div>

              <div className="issue-card__map">
                {Number.isFinite(issue?.location?.lat) && Number.isFinite(issue?.location?.lng) ? (
                  <MapContainer
                    key={`map-${issue.id}`}
                    center={[issue.location.lat, issue.location.lng]}
                    zoom={issue.mapZoom || 14}
                    style={{ height: '100%', borderRadius: '12px' }}
                    scrollWheelZoom={false}
                    whenReady={(map) => {
                      // Ensure the map sizes correctly inside cards
                      setTimeout(() => map.target.invalidateSize(), 0);
                    }}
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
                      <LayersControl.BaseLayer name="Street View">
                        <TileLayer
                          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                          subdomains={["mt0", "mt1", "mt2", "mt3"]}
                          attribution="&copy; Google"
                        />
                      </LayersControl.BaseLayer>
                    </LayersControl>
                    <Marker
                      position={[issue.location.lat, issue.location.lng]}
                      icon={L.icon({
                        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                      })}
                    />
                  </MapContainer>
                ) : (
                  <div className="issue-card__map--empty">
                    <span>{t('unknown') || 'No location available'}</span>
                  </div>
                )}
              </div>
              <div className="issue-card__meta">
                <p className="issue-card__location">
                  <strong>{t('location')}:</strong> {issue.addressLabel || issue.locationDetails || t('unknown')}
                </p>
                {issue.addressLabel && issue.locationDetails && (
                  <p className="issue-card__location-details">
                    <strong>Details:</strong> {issue.locationDetails}
                  </p>
                )}
              </div>
              <p className="issue-card__description">{issue.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
