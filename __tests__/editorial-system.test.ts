import { readFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');

function readSource(file: string) {
  return readFileSync(path.join(ROOT, file), 'utf8');
}

describe('editorial blog and changelog system', () => {
  it('uses a newest-post lead feature before the standard blog grid', () => {
    const blogIndex = readSource('app/blog/page.tsx');
    const postCard = readSource('components/blog/PostCard.tsx');

    expect(blogIndex).toContain('const [leadPost, ...restPosts] = posts;');
    expect(blogIndex).toContain('variant="lead"');
    expect(blogIndex).toContain('restPosts.map');
    expect(postCard).toContain("variant?: 'lead' | 'standard'");
  });

  it('shares the dark editorial shell across blog listing and tag routes', () => {
    const blogIndex = readSource('app/blog/page.tsx');
    const tagPage = readSource('app/blog/tag/[tag]/page.tsx');

    expect(blogIndex).toContain('EditorialShell');
    expect(tagPage).toContain('EditorialShell');
  });

  it('presents changelog entries as a flat release-notes timeline', () => {
    const changelog = readSource('app/changelog/page.tsx');

    expect(changelog).toContain('Release notes');
    expect(changelog).toContain('release-timeline');
    expect(changelog).toContain('signal');
  });

  it('keeps JSON-LD scripts on blog, tag, post, and changelog pages', () => {
    const files = [
      'app/blog/page.tsx',
      'app/blog/[slug]/page.tsx',
      'app/blog/tag/[tag]/page.tsx',
      'app/changelog/page.tsx'
    ];

    for (const file of files) {
      expect(readSource(file)).toContain('application/ld+json');
    }
  });
});
