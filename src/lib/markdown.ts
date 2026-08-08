import rehypeShiki from '@shikijs/rehype';
import type { Element, ElementContent, Root, RootContent } from 'hast';
import { toString as hastToString } from 'hast-util-to-string';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

/**
 * VENDORED COPY of personal-blog-front/src/lib/markdown.ts — keep the two in
 * sync so the admin live preview matches what the public site renders. See that
 * file for the conventions (figures via image title, "Table: " captions, TOC).
 */

export interface TocEntry {
  id: string;
  text: string;
}

const isElement = (node: ElementContent | RootContent | undefined, tag?: string): node is Element =>
  !!node && node.type === 'element' && (tag === undefined || node.tagName === tag);

const isWhitespace = (node: ElementContent | RootContent | undefined): boolean =>
  !!node && node.type === 'text' && node.value.trim() === '';

function rehypeFigures() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'p' || !parent || index === undefined) {
        return;
      }
      const meaningful = node.children.filter((child) => !isWhitespace(child));
      if (meaningful.length !== 1 || !isElement(meaningful[0], 'img')) {
        return;
      }
      const img = meaningful[0];
      img.properties.loading = 'lazy';
      const title = typeof img.properties.title === 'string' ? img.properties.title : '';
      delete img.properties.title;

      const children: ElementContent[] = [img];
      if (title) {
        children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: title }],
        });
      }
      parent.children[index] = { type: 'element', tagName: 'figure', properties: {}, children };
      return SKIP;
    });
  };
}

function rehypeTableCaptions() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) {
        return;
      }
      let nextIndex = index + 1;
      while (isWhitespace(parent.children[nextIndex])) {
        nextIndex += 1;
      }
      const next = parent.children[nextIndex];
      if (!isElement(next, 'p')) {
        return;
      }
      const [first, ...rest] = next.children;
      if (!first || first.type !== 'text' || !first.value.startsWith('Table:')) {
        return;
      }
      node.children.unshift({
        type: 'element',
        tagName: 'caption',
        properties: {},
        children: [
          { type: 'text', value: first.value.slice('Table:'.length).trimStart() },
          ...rest,
        ],
      });
      parent.children.splice(nextIndex, 1);
    });
  };
}

function rehypeTableWrap() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'table' || !parent || index === undefined) {
        return;
      }
      if (
        isElement(parent as Element) &&
        (parent as Element).tagName === 'div' &&
        Array.isArray((parent as Element).properties.className) &&
        ((parent as Element).properties.className as unknown[]).includes('table-wrap')
      ) {
        return;
      }
      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-wrap'] },
        children: [node],
      };
      return SKIP;
    });
  };
}

function collectToc() {
  return (tree: Root, file: VFile) => {
    const toc: TocEntry[] = [];
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'h2' && typeof node.properties.id === 'string') {
        toc.push({ id: node.properties.id, text: hastToString(node) });
      }
    });
    file.data.toc = toc;
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeKatex)
  .use(rehypeShiki, { theme: 'github-dark-default', fallbackLanguage: 'text' })
  .use(rehypeTableCaptions)
  .use(rehypeTableWrap)
  .use(rehypeFigures)
  .use(collectToc)
  .use(rehypeStringify);

export async function renderMarkdown(markdown: string): Promise<{ html: string; toc: TocEntry[] }> {
  const file = await processor.process(markdown);
  return { html: String(file), toc: (file.data.toc as TocEntry[] | undefined) ?? [] };
}
