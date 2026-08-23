import { useEffect, useState } from 'react';
import { getProfile, saveProfile } from '../../services/firestoreService';
import { SOCIAL_FIELDS } from './sectionConfig';

export default function SocialsEditor() {
  const [form, setForm] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const profile = await getProfile();
        if (!active) return;
        const f = {};
        for (const field of SOCIAL_FIELDS) {
          f[field.key] = profile?.socials?.[field.key] ?? '';
        }
        setForm(f);
        setLoaded(true);
      } catch (e) {
        if (active) setError(e.message);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const socials = {};
      for (const field of SOCIAL_FIELDS) {
        socials[field.key] = String(form[field.key] ?? '').trim();
      }
      await saveProfile({ socials });
      setMessage('Social links saved.');
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Social Links</h2>
      </div>
      {!loaded ? (
        <p className="muted">Loading…</p>
      ) : (
        <form className="card admin-form" onSubmit={save}>
          <p className="muted small" style={{ marginBottom: 16 }}>
            Paste full URLs (e.g. https://github.com/username). Leave blank to hide a platform.
          </p>
          <div className="form-grid">
            {SOCIAL_FIELDS.map((f) => (
              <div className="field" key={f.key}>
                <span className="field-label">{f.label}</span>
                <input
                  type="text"
                  value={form[f.key] ?? ''}
                  onChange={(e) => setField(f.key, e.target.value)}
                  placeholder={`https://...`}
                />
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Links'}
            </button>
          </div>
          {message && <p className="form-ok">{message}</p>}
          {error && <p className="form-error">{error}</p>}
        </form>
      )}
    </div>
  );
}
