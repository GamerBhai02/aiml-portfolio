export default function SetupScreen() {
  return (
    <div className="setup-screen">
      <div className="card setup-card">
        <h1>Firebase not configured</h1>
        <p>
          Copy <code>.env.example</code> to <code>.env</code> and fill in the
          Firebase web app credentials, then restart the dev server (or rebuild
          for Netlify).
        </p>
        <pre>{`VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abcdef123456`}</pre>
        <p className="muted small">
          Full instructions are in the README (Firebase setup + rules deploy).
        </p>
      </div>
    </div>
  );
}
