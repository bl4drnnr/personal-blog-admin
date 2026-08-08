import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { deleteAsset, listAssets, uploadAsset } from '@/api/assets';
import type { Asset } from '@/api/types';
import { useToast } from '@/components/toast';

function markdownSnippet(asset: Asset): string {
  return `![${asset.alt ?? ''}](${asset.url}${asset.alt ? ` "${asset.alt}"` : ''})`;
}

export function AssetsPage() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [alt, setAlt] = useState('');
  const [dragging, setDragging] = useState(false);

  const { data } = useQuery({
    queryKey: ['assets', search],
    queryFn: () => listAssets({ search: search || undefined, page: 1, per: 60 }),
  });

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
        {upload.isPending ? 'Uploading…' : 'Drop an image here or click to choose (max 10MB)'}
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      <input
        className="asset-search"
        placeholder="Search assets…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="asset-grid">
        {data?.items.map((asset) => (
          <div key={asset.id} className="asset-card">
            <img src={asset.url} alt={asset.alt ?? ''} />
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
          </div>
        ))}
        {data && data.items.length === 0 && <p className="muted">No assets yet.</p>}
      </div>
    </div>
  );
}
