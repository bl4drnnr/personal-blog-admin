import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { listAssets } from '@/api/assets';

interface Props {
  value: string | null;
  onChange: (assetId: string | null) => void;
}

/** Debounced searchable picker binding an asset UUID (used for hero/logo/avatar). */
export function AssetPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data } = useQuery({
    queryKey: ['assets', 'picker', search],
    queryFn: () => listAssets({ search, page: 1, per: 24 }),
    enabled: open,
  });

  const selected = data?.items.find((a) => a.id === value);

  return (
    <div className="asset-picker">
      <div className="asset-picker-current">
        {selected ? (
          <img src={selected.url} alt={selected.alt ?? ''} className="asset-thumb" />
        ) : value ? (
          <span className="muted">Selected asset</span>
        ) : (
          <span className="muted">No image</span>
        )}
        <div className="asset-picker-actions">
          <button type="button" className="btn" onClick={() => setOpen((o) => !o)}>
            {open ? 'Close' : 'Choose'}
          </button>
          {value && (
            <button type="button" className="btn ghost" onClick={() => onChange(null)}>
              Clear
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="asset-picker-panel">
          <input
            placeholder="Search assets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="asset-picker-grid">
            {data?.items.map((asset) => (
              <button
                type="button"
                key={asset.id}
                className={asset.id === value ? 'asset-cell selected' : 'asset-cell'}
                onClick={() => {
                  onChange(asset.id);
                  setOpen(false);
                }}
              >
                <img src={asset.url} alt={asset.alt ?? ''} />
              </button>
            ))}
            {data && data.items.length === 0 && <p className="muted">No assets found.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
