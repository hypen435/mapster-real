import { useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Login() {
  const { user, signInWithGoogle, loginWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/report" replace />; // Redirect to ReportIssue page if signed in
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await loginWithEmail(email, password);
      navigate('/report'); // Redirect to the ReportIssue page after login
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (submitting) return; // Prevent multiple popups
    setSubmitting(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/report');
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <form className="auth-card" onSubmit={onSubmit}>
        <h2>Sign in</h2>
        {error ? <div className="auth-error">{error}</div> : null}
        <label>
          <span>Email</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <label>
          <span>Password</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </label>
        <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
        <button
          type="button"
          className="auth-submit"
          style={{ marginTop: 8, background: '#222' }}
          onClick={handleGoogleSignIn}
          disabled={submitting} // Disable while signing in
        >
          {submitting ? 'Signing in…' : 'Continue with Google'}
        </button>
        <p className="auth-meta">No account? <a href="/signup">Create one</a></p>
      </form>
    </div>
  );
}


