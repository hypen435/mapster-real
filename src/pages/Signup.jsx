import { useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import './auth.css';

export default function Signup() {
  const { registerWithEmail } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await registerWithEmail(email, password, displayName);
      window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Create your account</h2>
        {error ? <div className="auth-error">{error}</div> : null}
        <label>
          <span>Name</span>
          <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </label>
        <label>
          <span>Confirm password</span>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required />
        </label>
        <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
        <p className="auth-meta">Already have an account? <a href="/login">Sign in</a></p>
      </form>
    </div>
  );
}
