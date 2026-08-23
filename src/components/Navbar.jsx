import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../services/firestoreService';

const LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/#about' },
  { label: 'Education', to: '/#education' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Projects', to: '/#projects' },
  { label: 'Research', to: '/#research' },
  { label: 'Certifications', to: '/#certifications' },
  { label: 'Achievements', to: '/#achievements' },
  { label: 'Blog', to: '/blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    getProfile()
      .then((p) => {
        if (p?.name) setName(p.name);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (e, to) => {
    setOpen(false);
    if (to.startsWith('/#')) {
      const hash = to.slice(1);
      // Already on the target section: re-trigger the scroll in place.
      // Otherwise let <Link> do an SPA navigation (no full reload) and
      // Home.jsx scrolls to the hash once its data has rendered.
      if (window.location.pathname === '/' && window.location.hash === hash) {
        e.preventDefault();
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          {name || 'Portfolio'}
        </Link>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map((l) => (
            <Link key={l.label} to={l.to} onClick={(e) => goTo(e, l.to)}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
