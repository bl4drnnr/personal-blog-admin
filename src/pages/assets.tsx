import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { deleteAsset, listAssets, uploadAsset } from '@/api/assets';
import type { Asset } from '@/api/types';
import { LoadingBlock, Spinner } from '@/components/loader';
import { useToast } from '@/components/toast';

const PER_PAGE_OPTIONS = [24, 48, 96] as const;

function markdownSnippet(asset: Asset): string {
  return `![${asset.alt ?? ''}](${asset.url}${asset.alt ? ` "${asset.alt}"` : ''})`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const kb = bytes / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

/** 'image/svg+xml' -> 'SVG'. Just the useful half, uppercased. */
function formatType(contentType: string): string {
  return (contentType.split('/')[1] ?? contentType).split('+')[0].toUpperCase();
}

function formatDate(iso: string): string {
  return iso.slice(0, 10);
}

export function AssetsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [alt, setAlt] = useState('');
  const [dragging, setDragging] = useState(false);
  const [page, setPage] = useState(1);
  const [per, setPer] = useState<number>(PER_PAGE_OPTIONS[0]);

  // A narrowed search almost always has fewer pages than the current offset.
  useEffect(() => {
    setPage(1);
  }, [search, per]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['assets', search, page, per],
    queryFn: () => listAssets({ search: search || undefined, page, per }),
    placeholderData: (previous) => previous,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per)) : 1;

  const upload = useMutation({
    mutationFn: (file: File) => uploadAsset(file, alt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      setAlt('');
      toast('Uploaded');
    },
    onError: () => toast('Upload failed (max 10MB, images only).', 'error'),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      toast('Deleted');
    },
    onError: () => toast('Delete failed.', 'error'),
  });

  const onFiles = (files: FileList | null) => {
    if (files && files[0]) {
      upload.mutate(files[0]);
    }
  };

  const copySnippet = (asset: Asset) => {
    navigator.clipboard.writeText(markdownSnippet(asset)).then(
      () => toast('Markdown copied'),
      () => toast('Copy failed.', 'error'),
    );
  };

  return (
    <div className="page">
      <h1 className="page-h1">Assets</h1>

      <label className="stacked">
        <span>Alt text for the next upload</span>
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="Describe the image…"
        />
      </label>

      <div
        className={dragging ? 'dropzone dragging' : 'dropzone'}
        onClick={() => fileInput.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          onFiles(e.dataTransfer.files);
        }}
      >
        {upload.isPending ? (
          <>
            <Spinner label="Uploading" /> Uploading…
          </>
        ) : (
          'Drop an image here or click to choose (max 10MB)'
        )}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      <div className="asset-toolbar">
        <input
          className="asset-search"
          placeholder="Search by name or alt text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="inline-select">
          <span>per page</span>
          <select value={per} onChange={(e) => setPer(Number(e.target.value))}>
            {PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        {data && (
          <span className="muted small asset-count">
            {data.total} {data.total === 1 ? 'image' : 'images'}
            {isFetching && !isLoading && <Spinner label="Refreshing" />}
          </span>
        )}
      </div>

      {isLoading ? (
        <LoadingBlock label="Loading assets…" />
      ) : (
        <>
          <div className="asset-grid">
            {data?.items.map((asset) => (
              <figure key={asset.id} className="asset-card">
                <img src={asset.url} alt={asset.alt ?? ''} loading="lazy" />
                <figcaption className="asset-meta">
                  <span className="asset-name" title={asset.filename || asset.s3Key}>
                    {asset.filename || '(no filename)'}
                  </span>
                  <span className="asset-facts">
                    {formatType(asset.contentType)} · {formatBytes(asset.sizeBytes)} ·{' '}
                    {formatDate(asset.createdAt)}
                  </span>
                  <span className="asset-alt" title={asset.alt ?? ''}>
                    {asset.alt ? `alt: ${asset.alt}` : 'no alt text'}
                  </span>
                </figcaption>
                <div className="asset-card-actions">
                  <button className="btn ghost small" onClick={() => copySnippet(asset)}>
                    Copy MD
                  </button>
                  <button
                    className="btn ghost small danger"
                    onClick={() => {
                      if (confirm('Delete this asset?')) {
                        remove.mutate(asset.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </figure>
            ))}
            {data && data.items.length === 0 && (
              <p className="muted">{search ? 'Nothing matches that search.' : 'No assets yet.'}</p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="table-pager">
              <button
                className="btn small"
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => p - 1)}
              >
                ‹ Previous
              </button>
              <span className="muted small">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn small"
                disabled={page >= totalPages || isFetching}
                onClick={() => setPage((p) => p + 1)}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
