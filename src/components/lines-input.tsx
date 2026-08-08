/** Edits a string[] as one-item-per-line textarea (bullets, etc.). */
export function LinesInput({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string[];
  onChange: (lines: string[]) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={value.join('\n')}
      onChange={(e) =>
        onChange(
          e.target.value
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean),
        )
      }
    />
  );
}
