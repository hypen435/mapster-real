// filepath: c:\Users\vatsa\Desktop\mapster\src\components\Navbar.jsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import '../navbar.css';
import { useAuth } from '../state/AuthContext.jsx';

const DiscordLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="18" fill="#5865F2" />
    <path fill="#fff" d="M25.18 14.24a.14.14 0 00-.07-.07A13.03 13.03 0 0022.83 13h-.01l-.23-.05a.15.15 0 00-.16.08c-.12.21-.24.41-.35.61a11.41 11.41 0 00-6.92 0 8.14 8.14 0 00-.36-.61.16.16 0 00-.16-.08l-.23.05a12.95 12.95 0 00-2.28 1.17c-.03.01-.06.04-.07.07C9.12 17.92 8.52 21.5 8.6 25.07c0 .08.06.15.14.16l1.9.6h.01c.08.02.17-.01.21-.08l.52-.7c.03-.05.08-.07.13-.05c1.88.83 3.91 1.29 6.07 1.31c2.16-.03 4.19-.48 6.07-1.31c.06-.02.11 0 .14.05l.52.7c.05.07.13.1.21.08h.01l1.9-.6a.16.16 0 00.13-.15c.11-3.6-.52-7.15-2.04-10.83zM13.36 21.75c-.82 0-1.49-.76-1.49-1.7c0-.93.66-1.7 1.48-1.7c.83 0 1.49.77 1.49 1.7c0 .94-.66 1.7-1.48 1.7zm6.98 0c-.82 0-1.49-.76-1.49-1.7c0-.93.66-1.7 1.48-1.7c.83 0 1.49.77 1.49 1.7c0 .94-.66 1.7-1.48 1.7z"/>
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOutUser } = useAuth();

  return (
    <header className="discord-navbar">
      <div className="nav-inner">
        <div className="nav-left">
          <DiscordLogo />
          <NavLink to="/"><span className="brand-name">MAPSTER</span></NavLink>
        </div>
        <button
          className={`hamburger${open ? " open" : ""}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          <span />
          <span />
          <span />
        </button>
        <nav id="primary-navigation" className={`nav-links${open ? " open" : ""}`} aria-label="Primary">
          <NavLink to="/about" className="nav-link" onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/report" className="nav-link" onClick={() => setOpen(false)}>Report Issue</NavLink>
          <NavLink to="/issues" className="nav-link" onClick={() => setOpen(false)}>View Issue</NavLink>
          <NavLink to="/live-map" className="nav-link" onClick={() => setOpen(false)}>Live Map</NavLink>
          <NavLink to="/contact" className="nav-link" onClick={() => setOpen(false)}>Contact</NavLink>
          {!user ? (
            <NavLink to="/signup" className="nav-link" onClick={() => setOpen(false)}>Sign up</NavLink>
          ) : null}
        </nav>
        <div className="nav-right">
          {user ? (
            <>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} style={{ width: 28, height: 28, borderRadius: '50%', marginRight: 8 }} />
              ) : null}
              <span className="user-name" style={{ marginRight: 8 }}>{user.displayName || user.email}</span>
              <button className="cta-btn-1" onClick={signOutUser}>Sign out</button>
            </>
          ) : (
            <NavLink to="/login" className="cta-btn-1">Sign in</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}