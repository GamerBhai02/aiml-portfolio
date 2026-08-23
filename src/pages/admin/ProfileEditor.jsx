import { useEffect, useState } from 'react';
import { getProfile, saveProfile } from '../../services/firestoreService';
import { PROFILE_FIELDS } from './sectionConfig';

export default function ProfileEditor() {
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
        for (const field of PROFILE_FIELDS) {
          f[field.key] = profile?.[field.key] ?? '';
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
      const payload = {};
      for (const field of PROFILE_FIELDS) {
        payload[field.key] = String(form[field.key] ?? '').trim();
      }
      await saveProfile(payload);
      setMessage('Profile saved.');
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h2>Profile</h2>
      </div>
      {!loaded ? (
        <p className="muted">Loading…</p>
      ) : (
        <form className="card admin-form" onSubmit={save}>
          <div className="form-grid">
            {PROFILE_FIELDS.map((f) => (
              <div className={`field ${f.type === 'textarea' ? 'full' : ''}`} key={f.key}>
                <span className="field-label">{f.label}</span>
                {f.type === 'textarea' ? (
                  <textarea
                    rows={f.rows || 4}
                    value={form[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder || ''}
                  />
                ) : (
                  <input
                    type="text"
                    value={form[f.key] ?? ''}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder || ''}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
          {message && <p className="form-ok">{message}</p>}
          {error && <p className="form-error">{error}</p>}
        </form>
      )}
    </div>
  );
}
