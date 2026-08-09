import { markdown as cmMarkdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import CodeMirror from '@uiw/react-codemirror';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError, errorMessage } from '@/api/client';
import { createPost, deletePost, getPost, updatePost } from '@/api/posts';
import type { PostInput, PostType } from '@/api/types';
import { AssetPicker } from '@/components/asset-picker';
import { LoadingBlock } from '@/components/loader';
import { MarkdownPreview } from '@/components/markdown-preview';
import { TagInput } from '@/components/tag-input';
import { useToast } from '@/components/toast';
import { slugify } from '@/lib/slug';

const EMPTY: PostInput = {
  type: 'article',
  slug: '',
  title: '',
  excerpt: '',
  contentMd: '',
  tags: [],
  featured: false,
  published: false,
};

export function PostEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();

  const [form, setForm] = useState<PostInput>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id as string),
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        type: existing.type,
        slug: existing.slug,
        title: existing.title,
        excerpt: existing.excerpt,
        contentMd: existing.contentMd,
        tags: existing.tags,
        featured: existing.featured,
        published: existing.published,
        repoUrl: existing.repoUrl ?? undefined,
        heroAssetId: existing.heroAssetId ?? undefined,
        seoTitle: existing.seoTitle ?? undefined,
        seoDescription: existing.seoDescription ?? undefined,
      });
      setSlugTouched(true);
    }
  }, [existing]);

  const set = <K extends keyof PostInput>(key: K, value: PostInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const onTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
    }));
  };

  const extensions = useMemo(() => [cmMarkdown({ codeLanguages: languages })], []);

  const save = useMutation({
    mutationFn: (publish: boolean) => {
      const payload: PostInput = { ...form, published: publish || form.published };
      return isNew ? createPost(payload) : updatePost(id as string, payload);
    },
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast('Saved');
      if (isNew) {
        navigate(`/posts/${post.id}`, { replace: true });
      } else {
        queryClient.invalidateQueries({ queryKey: ['post', id] });
      }
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 409) {
        toast('That slug is already in use.', 'error');
      } else {
        toast(errorMessage(err, 'Save failed.'), 'error');
      }
    },
  });

  const remove = useMutation({
    mutationFn: () => deletePost(id as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast('Deleted');
      navigate('/posts', { replace: true });
    },
    onError: () => toast('Delete failed.', 'error'),
  });

  // Mirrors the API's @Matches on CreatePostDto.slug. Without this the button
  // stays enabled for something like "My Post!", the request 400s, and the only
  // signal is a toast after the round trip.
  const slugInvalid = form.slug.trim() !== '' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug);
  const canSave = form.title.trim() !== '' && form.slug.trim() !== '' && !slugInvalid;

  if (isLoading) {
    return (
      <div className="page editor-page">
        <h1 className="page-h1">Edit post</h1>
        <LoadingBlock label="Loading post…" />
      </div>
    );
  }

  return (
    <div className="page editor-page">
      <div className="page-head-row">
        <h1 className="page-h1">{isNew ? 'New post' : 'Edit post'}</h1>
        <div className="editor-actions">
          {!isNew && (
            <button
              className="btn danger"
              onClick={() => {
                if (confirm('Delete this post? This cannot be undone.')) {
                  remove.mutate();
                }
              }}
            >
              Delete
            </button>
          )}
          <button
            className="btn"
            disabled={!canSave || save.isPending}
            onClick={() => save.mutate(false)}
          >
            Save draft
          </button>
          <button
            className="btn primary"
            disabled={!canSave || save.isPending}
            onClick={() => save.mutate(true)}
          >
            {form.published ? 'Save & keep published' : 'Publish'}
          </button>
        </div>
      </div>

      <label className="stacked editor-title">
        <span>Title</span>
        <input value={form.title} onChange={(e) => onTitleChange(e.target.value)} />
      </label>

      {/* Post metadata sits above the panes so the editor and preview get the
          full page width — this is where the time is actually spent. */}
      <section className="editor-meta">
        <label className="stacked">
          <span>Type</span>
          <select value={form.type} onChange={(e) => set('type', e.target.value as PostType)}>
            <option value="article">Article</option>
            <option value="project">Project</option>
          </select>
        </label>

        <label className="stacked">
          <span>Slug</span>
          <input
            value={form.slug}
            aria-invalid={slugInvalid}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', e.target.value);
            }}
          />
          {slugInvalid && (
            <span className="field-error">Lowercase letters, numbers and single hyphens only.</span>
          )}
        </label>

        <label className="stacked">
          <span>Excerpt</span>
          <input
            value={form.excerpt}
            maxLength={500}
            onChange={(e) => set('excerpt', e.target.value)}
          />
        </label>

        <label className="stacked">
          <span>Tags</span>
          <TagInput value={form.tags} onChange={(tags) => set('tags', tags)} />
        </label>

        {form.type === 'project' && (
          <label className="stacked">
            <span>Repo URL</span>
            <input
              value={form.repoUrl ?? ''}
              onChange={(e) => set('repoUrl', e.target.value || undefined)}
            />
          </label>
        )}

        <label className="stacked">
          <span>Hero image</span>
          <AssetPicker
            value={form.heroAssetId ?? null}
            onChange={(assetId) => set('heroAssetId', assetId ?? undefined)}
          />
        </label>

        <label className="inline">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set('featured', e.target.checked)}
          />
          <span>Featured (shown on the home page)</span>
        </label>

        <details className="seo-block">
          <summary>SEO overrides</summary>
          <label className="stacked">
            <span>SEO title</span>
            <input
              value={form.seoTitle ?? ''}
              onChange={(e) => set('seoTitle', e.target.value || undefined)}
            />
          </label>
          <label className="stacked">
            <span>SEO description</span>
            <textarea
              rows={2}
              value={form.seoDescription ?? ''}
              onChange={(e) => set('seoDescription', e.target.value || undefined)}
            />
          </label>
        </details>

        {existing && (
          <p className="muted small">
            {existing.published ? 'Published' : 'Draft'} · ~{existing.readingTimeMin} min read
          </p>
        )}
      </section>

      <div className="editor-split">
        <div className="editor-pane">
          <span className="pane-label">Markdown</span>
          {/* No height prop: .editor-split sizes both panes from one variable,
              so the editor and the preview can never disagree. */}
          <CodeMirror
            value={form.contentMd}
            extensions={extensions}
            onChange={(value) => set('contentMd', value)}
            basicSetup={{ lineNumbers: true, foldGutter: false }}
          />
        </div>
        <div className="editor-pane">
          <span className="pane-label">Preview</span>
          <div className="preview-scroll">
            <MarkdownPreview markdown={form.contentMd} />
          </div>
        </div>
      </div>
    </div>
  );
}
