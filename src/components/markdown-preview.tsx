import { useEffect, useState } from 'react';
import { renderMarkdown } from '@/lib/markdown';

/** Debounced live preview using the vendored front pipeline. */
export function MarkdownPreview({ markdown }: { markdown: string }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      renderMarkdown(markdown).then((result) => {
        if (!cancelled) {
          setHtml(result.html);
        }
      });
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [markdown]);

  // Content is the author's own markdown rendered by the same trusted pipeline
  // as the public site (raw HTML is dropped there).
  return <div className="markdown-preview prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
