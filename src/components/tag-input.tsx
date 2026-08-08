import { useState } from 'react';

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
}

/** Chip input: Enter or comma commits a tag; Backspace on empty removes the last. */
export function TagInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const tag = draft.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft('');
  };

  return (
    <div className="tag-input">
      {value.map((tag) => (
        <span key={tag} className="tag-chip">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((t) => t !== tag))}
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={draft}
        placeholder="Add tag…"
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          } else if (e.key === 'Backspace' && draft === '' && value.length > 0) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={commit}
      />
    </div>
  );
}
