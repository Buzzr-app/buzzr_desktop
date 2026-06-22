/** @jest-environment jsdom */
import { readFileSync } from 'node:fs';
import path from 'node:path';

test('placeholder smoke test', () => {
  // The actual page components are rendered by Next.js; this test simply
  // confirms the test runner is wired correctly.
  expect(true).toBe(true);
});

test('root layout uses the premium footer without stale launch embeds', () => {
  const rootLayout = readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');

  expect(rootLayout).not.toContain(['Product', 'HuntLaunchEmbed'].join(''));
  expect(rootLayout).toContain('BUZZR_TV_DISCLAIMER');
});

test('root layout has no light-mode bootstrap script', () => {
  const rootLayout = readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');

  expect(rootLayout).not.toContain('localStorage.getItem');
  expect(rootLayout).not.toContain('prefers-color-scheme');
  expect(rootLayout).not.toContain("classList.add('dark'");
  expect(rootLayout).toContain("themeColor: '#14181d'");
});
