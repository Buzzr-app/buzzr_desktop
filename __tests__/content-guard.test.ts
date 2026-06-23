import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');
const SCANNED_DIRS = ['app', 'components', 'src', 'content', 'docs', '__tests__'];
const MARKETING_DIRS = ['app', 'components', 'src', 'content', 'docs'];
const ROOT_FILES = ['README.md', 'HERO_REDESIGN_SPEC.md'];
const EXTENSIONS = new Set(['.css', '.md', '.mdx', '.ts', '.tsx']);

function sourceFiles(dir: string): string[] {
  const absolute = path.join(ROOT, dir);
  const entries = readdirSync(absolute);

  return entries.flatMap((entry) => {
    const fullPath = path.join(absolute, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      return sourceFiles(path.join(dir, entry));
    }

    return EXTENSIONS.has(path.extname(entry)) ? [path.join(dir, entry)] : [];
  });
}

function readSourceCorpus() {
  return [...ROOT_FILES, ...SCANNED_DIRS.flatMap(sourceFiles)].map((file) => ({
    file,
    text: readFileSync(path.join(ROOT, file), 'utf8')
  }));
}

describe('content guardrails', () => {
  const corpus = readSourceCorpus();
  const marketingCorpus = MARKETING_DIRS.flatMap(sourceFiles).map((file) => ({
    file,
    text: readFileSync(path.join(ROOT, file), 'utf8')
  }));

  it('contains zero em dashes in source, content, docs, and tests', () => {
    const hits = corpus
      .filter(({ text }) => text.includes('\u2014'))
      .map(({ file }) => file);

    expect(hits).toEqual([]);
  });

  it('does not reintroduce stale landing positioning', () => {
    const forbidden = [
      /Letterboxd for sports/i,
      /Letterboxd, for sports/i,
      /Rate sports games by entertainment/i,
      /rate live sports games on how good they actually were/i,
      /watch parties/i,
      /watch party/i,
      /screenshot-party/i,
      /Swipe to/i,
      /Swipe through/i,
      /swipe thing/i,
      /ProductHuntLaunchEmbed/i
    ];

    const hits = marketingCorpus.flatMap(({ file, text }) =>
      forbidden
        .filter((pattern) => pattern.test(text))
        .map((pattern) => `${file}: ${pattern.source}`)
    );

    expect(hits).toEqual([]);
  });

  it('keeps Buzzr dark-only with no runtime theme switch path', () => {
    const runtimeFiles = [
      'app/layout.tsx',
      'app/globals.css',
      'app/manifest.ts',
      'components/SiteHeader.tsx',
      'components/ui/ClayHeroScene.tsx',
      'src/lib/brandAssets.ts'
    ];

    const source = runtimeFiles
      .map((file) => readFileSync(path.join(ROOT, file), 'utf8'))
      .join('\n');

    expect(source).not.toContain('ThemeToggle');
    expect(source).not.toContain('localStorage.getItem(\'theme\')');
    expect(source).not.toContain('localStorage.theme');
    expect(source).not.toContain('prefers-color-scheme');
    expect(source).not.toContain('html.dark');
    expect(source).not.toContain('@custom-variant dark');
    expect(source).not.toContain("classList.add('dark'");
    expect(source).not.toContain("classList.toggle('dark'");
    expect(source).not.toContain('/brand/buzzr-mark-light.png');
    expect(source).not.toContain('MutationObserver');
    expect(readFileSync(path.join(ROOT, 'app/manifest.ts'), 'utf8')).toContain("theme_color: '#0a0a0c'");
  });

  it('uses the metallic Buzzr mark for visible landing branding', () => {
    const visibleBrandFiles = [
      'components/SiteHeader.tsx',
      'app/layout.tsx',
      'components/ui/HeroCopy.tsx',
      'components/sections/FinalCTA.tsx'
    ];

    const source = visibleBrandFiles
      .map((file) => readFileSync(path.join(ROOT, file), 'utf8'))
      .join('\n');

    expect(source).toContain('BrandMark');
    expect(source).toContain("variant=\"transparent\"");
    expect(source).not.toContain('AppIconMark');
    expect(source).not.toContain(' shell');
    expect(source).not.toContain('/buzzr-icon-light.svg');
    expect(source).not.toContain('/buzzr-icon-dark.svg');
  });

  it('keeps the landing dashboard scroll-driven instead of loop-driven', () => {
    const dataBento = readFileSync(
      path.join(ROOT, 'components/sections/DataBento.tsx'),
      'utf8'
    );

    expect(dataBento).not.toContain('BuzzSceneProvider');
    expect(dataBento).not.toContain('useBuzzScene');
    expect(dataBento).not.toContain('requestAnimationFrame');
    // Dashboard proof is now the in-code DashboardScreen, not a flat PNG.
    expect(dataBento).toContain('DashboardScreen');
  });

  it('uses app-screen assets for landing product proof sections', () => {
    const proofFiles = [
      'components/sections/DataBento.tsx',
      'components/sections/ScrollRail.tsx',
      'components/sections/SurfacesGrid.tsx',
      'components/ui/ClayHero.tsx',
      'components/ui/ClayHeroScene.tsx'
    ];

    const source = proofFiles
      .map((file) => readFileSync(path.join(ROOT, file), 'utf8'))
      .join('\n');

    expect(source).toContain('/app-screens/');
    expect(source).not.toContain('/screenshot-dashboard.png');
    expect(source).not.toContain('/screenshot-games.png');
    expect(source).not.toContain('/screenshot-home.png');
    expect(source).not.toContain('/screenshot-rate.png');
  });

  it('keeps the header install CTA single-line with nested radius math', () => {
    const header = readFileSync(path.join(ROOT, 'components/SiteHeader.tsx'), 'utf8');
    const css = readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');

    expect(header).toContain('site-nav-cta');
    expect(header).toContain('site-nav-cta-label');
    expect(css).toContain('--nav-control-radius: calc(var(--nav-radius) - var(--nav-pad-y));');
    expect(css).toContain('white-space: nowrap;');
    expect(header).not.toContain('rounded-button bg-accent px-4 py-2.5');
  });

  it('keeps the refined encircle hero copy and decorative SVG headline', () => {
    const heroCopy = readFileSync(path.join(ROOT, 'components/ui/HeroCopy.tsx'), 'utf8');

    expect(heroCopy).toContain('The home for all sports fans.');
    expect(heroCopy).toContain('<h1 id="hero-title" className="sr-only">');
    expect(heroCopy).toContain('viewBox="0 0 560 560"');
    expect(heroCopy).toContain('hero-encircle');
    expect(heroCopy).toContain('The home for all');
    expect(heroCopy).toContain('sports fans.');
    expect(heroCopy).not.toContain('The AI-native home for sports fans.');
  });

  it('moves AI Feed out of the top nav and keeps product anchors focused', () => {
    const header = readFileSync(path.join(ROOT, 'components/SiteHeader.tsx'), 'utf8');

    expect(header).toContain("label: 'Scroll'");
    expect(header).toContain("label: 'Dashboards'");
    expect(header).toContain("label: 'Friends'");
    expect(header).toContain("label: 'Leagues'");
    expect(header).toContain("label: 'Bets'");
    expect(header).not.toContain("label: 'AI'");
    expect(header).not.toContain("id: 'mission'");
  });

  it('uses the Everything Buzzr bento story instead of repeated screenshot cards', () => {
    const surfacesGrid = readFileSync(
      path.join(ROOT, 'components/sections/SurfacesGrid.tsx'),
      'utf8'
    );

    for (const label of ['01 Scroll', '02 Dashboards', '03 Friends and Chat', '04 Leagues', '05 AI Feed', '06 Bets']) {
      expect(surfacesGrid).toContain(label);
    }

    expect(surfacesGrid).toContain('Everything Buzzr');
    expect(surfacesGrid).toContain('Sports. Social. Seamless.');
    expect(surfacesGrid).toContain('SocialFeedPreview');
    expect(surfacesGrid).toContain('LeagueClusterPreview');
    expect(surfacesGrid).toContain('BetsPanelPreview');
    expect(surfacesGrid).not.toContain('The app map, without the clutter.');
  });

  it('uses generated editorial covers for blog posts', () => {
    const posts = sourceFiles('content/blog');
    const missingCovers = posts
      .map((file) => ({
        file,
        text: readFileSync(path.join(ROOT, file), 'utf8')
      }))
      .filter(({ text }) => !text.includes('src: "/blog-covers/'))
      .map(({ file }) => file);

    expect(missingCovers).toEqual([]);
  });

  it('mounts the simulator promo reel section from dedicated media paths', () => {
    const page = readFileSync(path.join(ROOT, 'app/page.tsx'), 'utf8');
    const promo = readFileSync(
      path.join(ROOT, 'components/sections/PromoReels.tsx'),
      'utf8'
    );

    expect(page).toContain('<PromoReels />');
    expect(promo).toContain('/promo/buzzr-scroll.mp4');
    expect(promo).toContain('/promo/buzzr-dashboard.mp4');
    expect(promo).toContain('/promo/buzzr-friends.mp4');
    expect(promo).toContain('/promo/buzzr-bets.mp4');
    expect(promo).toContain('/app-screens/bets-manual.png');
  });

  it('keeps and polishes the Buzzr 2.0 launch banner', () => {
    const launchBanner = readFileSync(path.join(ROOT, 'components/LaunchBanner.tsx'), 'utf8');

    expect(launchBanner).toContain('Buzzr 2.0 is live.');
    expect(launchBanner).toContain('Scroll, dashboards, leagues, and Bets in one app.');
    expect(launchBanner).toContain('Review on PH');
    expect(launchBanner).toContain('What changed');
    expect(launchBanner).toContain('pb-[calc(16px_+_env(safe-area-inset-bottom))]');
    expect(launchBanner).toContain('launch-banner-shell');
  });

});
