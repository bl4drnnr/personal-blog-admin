import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { listPosts } from '@/api/posts';
import type { PostType } from '@/api/types';

export function PostsListPage() {
  const [type, setType] = useState<'' | PostType>('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const per = 25;

  const { data, isLoading } = useQuery({
    queryKey: ['posts', type, search, page],
    queryFn: () => listPosts({ type: type || undefined, search: search || undefined, page, per }),
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / per)) : 1;

  return (
    <div className="page">
      <div className="page-head-row">
        <h1 className="page-h1">Posts</h1>
        <Link to="/posts/new" className="btn primary">
          New post
        </Link>
      </div>

      <div className="filter-row">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as '' | PostType);
            setPage(1);
          }}
        >
          <option value="">All types</option>
          <option value="article">Articles</option>
          <option value="project">Projects</option>
        </select>
        <input
          placeholder="Search by title…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <p className="muted">Loading…</p>
      ) : !data || data.items.length === 0 ? (
        <p className="muted">No posts yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((post) => (
              <tr key={post.id}>
                <td>
                  <Link to={`/posts/${post.id}`} className="row-link">
                    {post.title}
                  </Link>
                </td>
                <td className="mono">{post.type}</td>
                <td>
                  <span className={post.published ? 'status published' : 'status draft'}>
                    {post.published ? 'published' : 'draft'}
                  </span>
                </td>
                <td className="mono">{post.featured ? '★' : '—'}</td>
                <td className="mono muted">{post.updatedAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data && totalPages > 1 && (
        <div className="table-pager">
          <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ‹ Prev
          </button>
          <span className="mono muted">
            {page} / {totalPages}
          </span>
          <button
            className="btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
