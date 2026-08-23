import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, COLLECTIONS } from '../services/firestoreService';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import Reveal from '../components/Reveal';
import { formatDate, firstParagraph, sortByOrder } from '../utils/format';

export default function BlogList() {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const all = await getItems(COLLECTIONS.blog, 'createdAt', 'desc');
        if (active) setPosts(sortByOrder(all.filter((p) => p.published)));
      } catch (e) {
        if (active) setError(e.message);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="page-error">
        <h2>Could not load posts</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!posts) return <Loading full />;

  return (
    <div className="page">
      <div className="page-head">
        <h1>Blog</h1>
        <p className="muted">Thoughts, notes and write-ups.</p>
      </div>
      {posts.length === 0 ? (
        <EmptyState message="No posts published yet — check back soon." />
      ) : (
        <div className="grid-cards">
          {posts.map((post) => (
            <Reveal key={post.id}>
              <Link className="card blog-card" to={`/blog/${post.id}`}>
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} loading="lazy" />
                )}
                <h3>{post.title}</h3>
                <p>{formatDate(post.createdAt)}</p>
                {firstParagraph(post.content) && (
                  <p className="small" style={{ marginTop: 8 }}>
                    {firstParagraph(post.content)}
                  </p>
                )}
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
      )}
    </div>
  );
}
