import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getItem, COLLECTIONS } from '../services/firestoreService';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';
import { formatDate } from '../utils/format';
import usePageMeta from '../hooks/usePageMeta';

export default function BlogPost() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [post, setPost] = useState(undefined);
  const [error, setError] = useState(null);

  usePageMeta({
    title: post?.title ? `${post.title} — Abu Talha Ansari` : 'Blog — Abu Talha Ansari',
    description: post?.content
      ? post.content.split(/\n{2,}/)[0].slice(0, 160)
      : 'Blog post by Abu Talha Ansari.',
    path: `/blog/${id}`,
    image: post?.coverImage || undefined,
    noindex: Boolean(post && !post.published),
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const doc = await getItem(COLLECTIONS.blog, id);
        if (active) setPost(doc);
      } catch (e) {
        if (active) setError(e.message);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="page-error">
        <h2>Could not load this post</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (authLoading || post === undefined) return <Loading full />;

  // Drafts are visible only to the signed-in admin.
  if (!post || (!post.published && !user)) {
    return (
      <div className="page-error">
        <h2>Post not found</h2>
        <p>This post does not exist or has not been published.</p>
        <Link to="/blog">Back to blog</Link>
      </div>
    );
  }

  return (
    <div className="page page-narrow">
      <Link className="back-link" to="/blog">
        ← Back to blog
      </Link>
      <div className="blog-content">
        <h1 className="blog-title">{post.title}</h1>
        <div className="blog-meta">
          <span>{formatDate(post.createdAt)}</span>
          {post.tags?.length > 0 && (
            <span className="tags">
              {post.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </span>
          )}
        </div>
        {post.coverImage && <img className="cover" src={post.coverImage} alt={post.title} />}
        <article>
          {(post.content || '')
            .split(/\n{2,}/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((p, i) => (
              <p key={i}>{p}</p>
            ))}
        </article>
      </div>
    </div>
  );
}
