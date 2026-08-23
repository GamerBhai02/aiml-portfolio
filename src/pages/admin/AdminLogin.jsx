import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

export function friendlyAuthError(code) {
  const map = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/network-request-failed': 'Network error — check your connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  };
  return map[code] || 'Sign in failed. Please try again.';
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged in AdminGate switches to the dashboard automatically.
    } catch (err) {
      setError(friendlyAuthError(err.code));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="card login-card">
        <h1>Admin Login</h1>
        <p className="sub">Sign in to manage your portfolio.</p>
        <form onSubmit={submit}>
          <div className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
          {error && <p className="form-error">{error}</p>}
        </form>
        <p className="hint">
          First time? Create your admin user in the Firebase Console
          (Authentication → Users → Add user), then sign in here. See the README
          for the full setup.
        </p>
      </div>
    </div>
  );
}
