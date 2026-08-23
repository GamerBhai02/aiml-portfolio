import { useEffect, useState } from 'react';
import { getItems, addItem, updateItem, removeItem } from '../../services/firestoreService';
import { sortByOrder } from '../../utils/format';

export default function CollectionManager({ config }) {
  const { collection, label, singular, fields, titleKey } = config;
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // null = closed, 'new' = adding, id = editing
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setItems(await getItems(collection, 'createdAt', 'desc'));
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const startNew = () => {
    setForm({});
    setEditingId('new');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEdit = (item) => {
    const f = {};
    for (const field of fields) {
      const v = item[field.key];
      if (field.type === 'list') {
        f[field.key] = Array.isArray(v) ? v.join(', ') : v || '';
      } else {
        f[field.key] = v ?? '';
      }
    }
    f.order = typeof item.order === 'number' ? item.order : '';
    setForm(f);
    setEditingId(item.id);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancel = () => {
    setEditingId(null);
    setForm({});
    setError(null);
  };

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    for (const f of fields) {
      if (f.required && !String(form[f.key] ?? '').trim()) {
        return `"${f.label}" is required.`;
      }
    }
    if (form.level !== undefined && form.level !== '') {
      const n = Number(form.level);
      if (Number.isNaN(n) || n < 0 || n > 100) {
        return 'Proficiency must be a number between 0 and 100.';
      }
    }
    if (form.order !== undefined && form.order !== '') {
      const n = Number(form.order);
      if (Number.isNaN(n) || n < 0) {
        return 'Order must be a number of 0 or more.';
      }
    }
    return null;
  };

  const serialize = () => {
    const out = {};
    for (const f of fields) {
      let v = form[f.key];
      if (f.type === 'list') {
        v = String(v || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (f.type === 'boolean') {
        v = Boolean(v);
      } else if (f.type === 'number') {
        v = v === '' || v === undefined || v === null ? null : Number(v);
      } else {
        v = String(v ?? '').trim();
      }
      out[f.key] = v;
    }
    let order = form.order;
    if (order === '' || order === undefined || order === null) {
      order = items ? items.length : 0;
    } else {
      order = Number(order);
    }
    out.order = order;
    return out;
  };

  const save = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = serialize();
      if (editingId === 'new') {
        await addItem(collection, payload);
      } else {
        await updateItem(collection, editingId, payload);
      }
      setEditingId(null);
      setForm({});
      await load();
    } catch (e2) {
      setError(e2.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await removeItem(collection, id);
      await load();
    } catch (e2) {
      setError(e2.message);
    }
  };

  // Move an entry up/down and renumber the whole list so order stays consistent.
  const move = async (id, dir) => {
    const sorted = sortByOrder(items || []);
    const idx = sorted.findIndex((i) => i.id === id);
    const swapIdx = idx + dir;
    if (idx === -1 || swapIdx < 0 || swapIdx >= sorted.length) return;
    [sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]];
    try {
      await Promise.all(sorted.map((item, i) => updateItem(collection, item.id, { order: i })));
      await load();
    } catch (e2) {
      setError(e2.message);
    }
  };

  const preview = (item) => {
    const v = item[titleKey];
    return v ? String(v) : item.id;
  };

  const subtitle = (item) => {
    const f = fields.find(
      (x) => x.key !== titleKey && item[x.key] && ['text', 'list', 'number'].includes(x.type)
    );
    if (!f) return null;
    const v = item[f.key];
    return Array.isArray(v) ? v.join(', ') : String(v);
  };

  const renderField = (f) => {
    const labelEl = (
      <span className="field-label">
        {f.label}
        {f.required ? ' *' : ''}
      </span>
    );
    if (f.type === 'textarea') {
      return (
        <div className="field full" key={f.key}>
          {labelEl}
          <textarea
            rows={f.rows || 4}
            value={form[f.key] ?? ''}
            onChange={(e) => setField(f.key, e.target.value)}
            placeholder={f.placeholder || ''}
          />
        </div>
      );
    }
    if (f.type === 'boolean') {
      return (
        <label className="field check" key={f.key}>
          <input
            type="checkbox"
            checked={Boolean(form[f.key])}
            onChange={(e) => setField(f.key, e.target.checked)}
          />
          <span>{f.label}</span>
        </label>
      );
    }
    return (
      <div className="field" key={f.key}>
        {labelEl}
        <input
          type={f.type === 'number' ? 'number' : 'text'}
          min={f.min}
          max={f.max}
          value={form[f.key] ?? ''}
          onChange={(e) => setField(f.key, e.target.value)}
          placeholder={f.placeholder || ''}
        />
      </div>
    );
  };

  return (
    <div>
      <div className="admin-header">
        <h2>{label}</h2>
        {editingId === null && (
          <button className="btn btn-primary btn-small" onClick={startNew}>
            + Add {singular}
          </button>
        )}
      </div>

      {editingId !== null && (
        <form className="card admin-form" onSubmit={save}>
          <h3>{editingId === 'new' ? `Add ${singular}` : `Edit ${singular}`}</h3>
          <div className="form-grid">
            {fields.map(renderField)}
            <div className="field">
              <span className="field-label">Order / Position (lower appears first)</span>
              <input
                type="number"
                min={0}
                value={form.order ?? ''}
                onChange={(e) => setField('order', e.target.value)}
                placeholder="Auto — appears last"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={cancel} disabled={saving}>
              Cancel
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </form>
      )}

      {error && editingId === null && <p className="form-error">{error}</p>}

      {items === null ? (
        <p className="muted">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted">Nothing here yet. Click "+ Add {singular}" to create the first entry.</p>
      ) : (
        <>
          <p className="muted small" style={{ marginBottom: 14 }}>
            Order shown here is what visitors see. Use the arrows to move an entry up or
            down (or set Order in the form).
          </p>
          <ul className="admin-items">
            {sortByOrder(items).map((item, index) => (
              <li className="admin-item" key={item.id}>
                <div className="admin-item-info">
                  <strong>
                    {index + 1}. {preview(item)}
                  </strong>
                  {subtitle(item) && <span>{subtitle(item)}</span>}
                  {item.published !== undefined && (
                    <span className={item.published ? 'pill ok' : 'pill'}>
                      {item.published ? 'Published' : 'Draft'}
                    </span>
                  )}
                </div>
                <div className="admin-item-actions">
                  <button
                    className="btn btn-small"
                    onClick={() => move(item.id, -1)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    className="btn btn-small"
                    onClick={() => move(item.id, 1)}
                    disabled={index === sortByOrder(items).length - 1}
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button className="btn btn-small" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-small danger"
                    onClick={() => remove(item.id, preview(item))}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
