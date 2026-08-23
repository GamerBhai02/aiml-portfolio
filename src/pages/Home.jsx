import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Scene3D from '../components/Scene3D';
import Section from '../components/Section';
import Loading from '../components/Loading';
import Reveal from '../components/Reveal';
import SocialIcons from '../components/SocialIcons';
import { getProfile, getItems, COLLECTIONS } from '../services/firestoreService';
import { formatDate, sortByOrder } from '../utils/format';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [
          profile,
          education,
          skills,
          projects,
          patents,
          papers,
          certifications,
          achievements,
          allPosts,
        ] = await Promise.all([
          getProfile(),
          getItems(COLLECTIONS.education, 'createdAt', 'desc'),
          getItems(COLLECTIONS.skills, 'createdAt', 'desc'),
          getItems(COLLECTIONS.projects, 'createdAt', 'desc'),
          getItems(COLLECTIONS.patents, 'createdAt', 'desc'),
          getItems(COLLECTIONS.papers, 'createdAt', 'desc'),
          getItems(COLLECTIONS.certifications, 'createdAt', 'desc'),
          getItems(COLLECTIONS.achievements, 'createdAt', 'desc'),
          getItems(COLLECTIONS.blog, 'createdAt', 'desc'),
        ]);
        if (!active) return;
        setData({
          profile,
          education: sortByOrder(education),
          skills: sortByOrder(skills),
          projects: sortByOrder(projects),
          patents: sortByOrder(patents),
          papers: sortByOrder(papers),
          certifications: sortByOrder(certifications),
          achievements: sortByOrder(achievements),
          posts: sortByOrder(allPosts.filter((p) => p.published)).slice(0, 3),
        });
      } catch (e) {
        if (active) setError(e.message || 'Failed to load data');
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Smooth-scroll to a section hash (e.g. /#projects) after the section has
  // actually rendered, including SPA navigation from other routes.
  useEffect(() => {
    const hash = location.hash;
    if (hash && data) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location, data]);

  if (error) {
    return (
      <div className="page-error">
        <h2>Could not load the portfolio</h2>
        <p>{error}</p>
        <p>Make sure your .env is correct and the Firestore rules allow public reads.</p>
      </div>
    );
  }

  if (!data) return <Loading full />;

  const { profile } = data;
  const socials = profile?.socials || {};
  const hasSocials = Object.values(socials).some(Boolean);
  const hasAbout = Boolean(
    profile?.bio || profile?.email || profile?.location || profile?.university || hasSocials
  );
  const hasContact = Boolean(profile?.email || hasSocials);

  const groups = {};
  data.skills.forEach((s) => {
    const cat = s.category || 'General';
    (groups[cat] = groups[cat] || []).push(s);
  });

  return (
    <>
      {/* ===== Hero ===== */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <Scene3D />
        </div>
        <div className="hero-content">
          {profile?.avatarUrl ? (
            <img className="hero-avatar" src={profile.avatarUrl} alt="avatar" />
          ) : (
            <div className="hero-avatar placeholder">
              {(profile?.name || 'A').trim().charAt(0).toUpperCase()}
            </div>
          )}
          <p className="hero-kicker">Hello, I am</p>
          <h1 className="hero-name">{profile?.name || 'Your Name'}</h1>
          <p className="hero-title">{profile?.title || 'AI / ML Engineer'}</p>
          {profile?.tagline && <p className="hero-tagline">{profile.tagline}</p>}
          <div className="hero-actions">
            {profile?.resumeUrl && (
              <a
                className="btn btn-primary"
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            )}
            <a className="btn btn-ghost" href="#projects">
              View Projects
            </a>
            <Link className="btn btn-ghost" to="/blog">
              Read Blog
            </Link>
          </div>
          <SocialIcons socials={profile?.socials} />
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      {/* ===== About ===== */}
      {hasAbout && (
      <Section id="about" title="About Me" subtitle="Who I am and how to reach me">
        <Reveal>
          <div className="about-grid">
            <div className="card about-bio">
              <p>
                {profile?.bio ||
                  'Add your bio from the admin panel — it will appear here.'}
              </p>
            </div>
            <div className="card about-meta">
              <ul>
                {profile?.email && (
                  <li>
                    <span>Email</span>
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>
                  </li>
                )}
                {profile?.location && (
                  <li>
                    <span>Location</span>
                    <span>{profile.location}</span>
                  </li>
                )}
                {profile?.university && (
                  <li>
                    <span>University</span>
                    <span>{profile.university}</span>
                  </li>
                )}
              </ul>
              <SocialIcons socials={profile?.socials} />
            </div>
          </div>
        </Reveal>
      </Section>
      )}

      {/* ===== Education ===== */}
      {data.education.length > 0 && (
      <Section id="education" title="Education">
          <div className="timeline">
            {data.education.map((e) => (
              <Reveal key={e.id}>
                <div className="timeline-item card">
                  <div className="timeline-dot" />
                  <div className="timeline-head">
                    <h3>
                      {e.degree}
                      {e.field ? ` in ${e.field}` : ''}
                    </h3>
                    <span className="badge">
                      {e.start}
                      {e.end ? ` — ${e.end}` : ''}
                    </span>
                  </div>
                  <p className="timeline-school">{e.institution}</p>
                  {e.description && <p className="muted">{e.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
      </Section>
      )}

      {/* ===== Skills ===== */}
      {data.skills.length > 0 && (
      <Section id="skills" title="Skills">
          <div className="skills-groups">
            {Object.entries(groups).map(([cat, list]) => (
              <Reveal key={cat}>
                <div className="card skill-group">
                  <h3>{cat}</h3>
                  <div className="skill-bars">
                    {list.map((s) => (
                      <div className="skill" key={s.id}>
                        <div className="skill-head">
                          <span>{s.name}</span>
                          <span>{s.level ?? 0}%</span>
                        </div>
                        <div className="skill-track">
                          <div
                            className="skill-fill"
                            style={{ width: `${s.level ?? 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
      </Section>
      )}

      {/* ===== Projects ===== */}
      {data.projects.length > 0 && (
      <Section id="projects" title="Projects" subtitle="Things I have built">
          <div className="grid-cards">
            {data.projects.map((p) => (
              <Reveal key={p.id}>
                <article className="card project-card">
                  {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
                  <h3>{p.title}</h3>
                  {p.description && <p>{p.description}</p>}
                  {p.tech?.length > 0 && (
                    <div className="tags">
                      {p.tech.map((t) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="card-actions">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer">
                        GitHub
                      </a>
                    )}
                    {p.demo && (
                      <a href={p.demo} target="_blank" rel="noopener noreferrer">
                        Live Demo
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
      </Section>
      )}

      {/* ===== Research ===== */}
      {(data.patents.length > 0 || data.papers.length > 0) && (
      <Section id="research" title="Research" subtitle="Patents and publications">
        {data.patents.length > 0 && (
        <>
        <h3 className="sub-head">Patents</h3>
        <div className="stack">
            {data.patents.map((p) => (
              <Reveal key={p.id}>
                <div className="card list-card">
                  <div className="list-card-head">
                    <h3>{p.title}</h3>
                    {p.status && <span className="badge">{p.status}</span>}
                  </div>
                  <p className="muted">
                    {[p.patentNumber && `No. ${p.patentNumber}`, p.year && `Year: ${p.year}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  {p.description && <p>{p.description}</p>}
                </div>
              </Reveal>
            ))}
        </div>
        </>
        )}

        {data.papers.length > 0 && (
        <>
        <h3 className="sub-head">Research Papers</h3>
        <div className="stack">
            {data.papers.map((p) => (
              <Reveal key={p.id}>
                <div className="card list-card">
                  <h3>
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noopener noreferrer">
                        {p.title}
                      </a>
                    ) : (
                      p.title
                    )}
                  </h3>
                  <p className="muted">
                    {[p.authors, p.journal, p.year && `(${p.year})`]
                      .filter(Boolean)
                      .join(' — ')}
                  </p>
                  {p.description && <p>{p.description}</p>}
                </div>
              </Reveal>
            ))}
        </div>
        </>
        )}
      </Section>
      )}

      {/* ===== Certifications ===== */}
      {data.certifications.length > 0 && (
      <Section id="certifications" title="Certifications">
          <div className="grid-cards">
            {data.certifications.map((c) => (
              <Reveal key={c.id}>
                <div className="card list-card">
                  <div className="list-card-head">
                    <h3>
                      {c.credentialUrl ? (
                        <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer">
                          {c.title}
                        </a>
                      ) : (
                        c.title
                      )}
                    </h3>
                    {c.year && <span className="badge">{c.year}</span>}
                  </div>
                  {c.issuer && <p className="muted">{c.issuer}</p>}
                  {c.description && <p>{c.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
      </Section>
      )}

      {/* ===== Achievements ===== */}
      {data.achievements.length > 0 && (
      <Section id="achievements" title="Achievements">
          <div className="stack">
            {data.achievements.map((a) => (
              <Reveal key={a.id}>
                <div className="card list-card">
                  <div className="list-card-head">
                    <h3>{a.title}</h3>
                    {a.year && <span className="badge">{a.year}</span>}
                  </div>
                  {a.description && <p>{a.description}</p>}
                </div>
              </Reveal>
            ))}
          </div>
      </Section>
      )}

      {/* ===== Blog preview ===== */}
      {data.posts.length > 0 && (
      <Section id="blog" title="Latest Posts" subtitle="From my blog">
          <>
            <div className="grid-cards">
              {data.posts.map((post) => (
                <Reveal key={post.id}>
                  <Link className="card blog-card" to={`/blog/${post.id}`}>
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} loading="lazy" />
                    )}
                    <h3>{post.title}</h3>
                    <p>{formatDate(post.createdAt)}</p>
                    {post.tags?.length > 0 && (
                      <div className="tags">
                        {post.tags.slice(0, 4).map((t) => (
                          <span className="tag" key={t}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </Reveal>
              ))}
            </div>
            <div style={{ marginTop: 26, textAlign: 'center' }}>
              <Link className="btn btn-ghost" to="/blog">
                View all posts
              </Link>
            </div>
          </>
      </Section>
      )}

      {/* ===== Contact ===== */}
      {hasContact && (
      <Section id="contact" title="Get In Touch">
        <Reveal>
          <div className="card contact-card">
            <p>
              Want to collaborate, discuss research, or just say hi? Reach out
              through any channel below.
            </p>
            <SocialIcons socials={profile?.socials} email={profile?.email} />
          </div>
        </Reveal>
      </Section>
      )}
    </>
  );
}
