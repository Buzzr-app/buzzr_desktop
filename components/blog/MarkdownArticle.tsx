import Link from 'next/link';
import type { ReactNode } from 'react';
import type {
  Blockquote,
  Code,
  Content,
  Delete,
  Emphasis,
  Heading,
  Html,
  Image,
  InlineCode,
  Link as MarkdownLink,
  List,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
  Strong,
  Text
} from 'mdast';
import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

const parser = unified().use(remarkParse);

function slugFromHeading(node: Heading) {
  return toString(node)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function renderPhrasing(nodes: PhrasingContent[], keyPrefix: string): ReactNode[] {
  return nodes.map((node, index) => renderPhrasingNode(node, `${keyPrefix}-${index}`));
}

function renderPhrasingNode(node: PhrasingContent, key: string): ReactNode {
  switch (node.type) {
    case 'text':
      return (node as Text).value;
    case 'emphasis':
      return <em key={key}>{renderPhrasing((node as Emphasis).children, key)}</em>;
    case 'strong':
      return <strong key={key}>{renderPhrasing((node as Strong).children, key)}</strong>;
    case 'delete':
      return <del key={key}>{renderPhrasing((node as Delete).children, key)}</del>;
    case 'inlineCode':
      return <code key={key}>{(node as InlineCode).value}</code>;
    case 'break':
      return <br key={key} />;
    case 'link': {
      const link = node as MarkdownLink;
      const children = renderPhrasing(link.children, key);
      const isExternal = /^https?:\/\//.test(link.url);

      if (isExternal) {
        return (
          <a key={key} href={link.url} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }

      return (
        <Link key={key} href={link.url}>
          {children}
        </Link>
      );
    }
    case 'image': {
      const image = node as Image;
      return image.alt ?? '';
    }
    case 'html':
      return (node as Html).value;
    case 'linkReference':
    case 'imageReference':
    case 'footnoteReference':
      return toString(node);
    default:
      return toString(node);
  }
}

function renderListItem(node: ListItem, key: string) {
  return (
    <li key={key}>
      {node.children.map((child, index) => {
        if (child.type === 'paragraph') {
          return (
            <span key={`${key}-${index}`}>
              {renderPhrasing((child as Paragraph).children, `${key}-${index}`)}
            </span>
          );
        }

        return renderBlockNode(child, `${key}-${index}`);
      })}
    </li>
  );
}

function renderBlockNode(node: Content, key: string): ReactNode {
  switch (node.type) {
    case 'heading': {
      const heading = node as Heading;
      const id = slugFromHeading(heading);
      const children = renderPhrasing(heading.children, key);

      if (heading.depth === 3) {
        return (
          <h3 key={key} id={id}>
            <a href={`#${id}`}>{children}</a>
          </h3>
        );
      }

      return (
        <h2 key={key} id={id}>
          <a href={`#${id}`}>{children}</a>
        </h2>
      );
    }
    case 'paragraph':
      return <p key={key}>{renderPhrasing((node as Paragraph).children, key)}</p>;
    case 'list': {
      const list = node as List;
      const items = list.children.map((item, index) => renderListItem(item, `${key}-${index}`));

      return list.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
    }
    case 'blockquote':
      return <blockquote key={key}>{(node as Blockquote).children.map((child, index) => renderBlockNode(child, `${key}-${index}`))}</blockquote>;
    case 'code': {
      const code = node as Code;
      return (
        <pre key={key}>
          <code>{code.value}</code>
        </pre>
      );
    }
    case 'thematicBreak':
      return <hr key={key} />;
    case 'break':
      return <br key={key} />;
    case 'html':
      return (node as Html).value;
    case 'delete':
      return <del key={key}>{renderPhrasing((node as Delete).children, key)}</del>;
    default:
      return null;
  }
}

export function MarkdownArticle({ source }: { source: string }) {
  const tree = parser.parse(source) as Root;

  return <>{tree.children.map((node, index) => renderBlockNode(node, `block-${index}`))}</>;
}
