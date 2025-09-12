import { NavLink } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="stack gap-lg" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <h1 className="title">404</h1>
      <p className="muted" style={{ fontSize: 18 }}>The page you’re looking for doesn’t exist.</p>
      <div className="row gap-sm" style={{ gap: 12 }}>
        <NavLink to="/" className="btn">Go Home</NavLink>
        <NavLink to="/issues" className="btn primary">View Issues</NavLink>
      </div>
    </section>
  );
}


