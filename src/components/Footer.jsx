import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../services/firestoreService';

export default function Footer() {
  const [name, setName] = useState('');

  useEffect(() => {
    getProfile()
      .then((p) => {
        if (p?.name) setName(p.name);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="brand">{name || 'Portfolio'}</p>
        <p className="muted">Built with React, Three.js and Firestore.</p>
        <p className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/blog">Blog</Link>
        </p>
        <p className="muted small">
          © {new Date().getFullYear()} Abu Talha Ansari. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
