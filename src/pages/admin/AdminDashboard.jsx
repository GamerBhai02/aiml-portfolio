import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { SECTIONS } from './sectionConfig';
import CollectionManager from './CollectionManager';
import ProfileEditor from './ProfileEditor';
import SocialsEditor from './SocialsEditor';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'socials', label: 'Social Links' },
  ...Object.entries(SECTIONS).map(([id, cfg]) => ({ id, label: cfg.label })),
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('profile');

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
        <button className="logout" onClick={() => signOut(auth)}>
          Sign Out
        </button>
      </aside>
      <main className="admin-main">
        {tab === 'profile' && <ProfileEditor />}
        {tab === 'socials' && <SocialsEditor />}
        {tab !== 'profile' && tab !== 'socials' && (
          <CollectionManager key={tab} config={SECTIONS[tab]} />
        )}
      </main>
    </div>
  );
}
