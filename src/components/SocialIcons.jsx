const PLATFORMS = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'leetcode', label: 'LeetCode' },
  { key: 'twitter', label: 'Twitter / X' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'telegram', label: 'Telegram' },
  { key: 'website', label: 'Website' },
];

export default function SocialIcons({ socials = {}, email }) {
  const links = PLATFORMS.filter((p) => socials[p.key]);
  if (links.length === 0 && !email) return null;
  return (
    <div className="socials">
      {email && (
        <a className="social-link" href={`mailto:${email}`} title="Email">
          Email
        </a>
      )}
      {links.map((p) => (
        <a
          key={p.key}
          href={socials[p.key]}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          title={p.label}
        >
          {p.label}
        </a>
      ))}
    </div>
  );
}
