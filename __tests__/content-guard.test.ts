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

  it('removes the standalone dashboard proof section from the landing page', () => {
    const page = readFileSync(path.join(ROOT, 'app/page.tsx'), 'utf8');
    const header = readFileSync(path.join(ROOT, 'components/SiteHeader.tsx'), 'utf8');
    const surfacesGrid = readFileSync(
      path.join(ROOT, 'components/sections/SurfacesGrid.tsx'),
      'utf8'
    );
    const dashboardWidgetStage = readFileSync(
      path.join(ROOT, 'components/ui/DashboardWidgetStage.tsx'),
      'utf8'
    );

    expect(page).not.toContain('<DataBento />');
    expect(page).not.toContain("from '@/components/sections/DataBento'");
    expect(header).not.toContain("id: 'data'");
    expect(header).not.toContain("label: 'Dashboards'");
    expect(page).not.toContain('Tailor the Buzz to You');
    expect(surfacesGrid).toContain('DashboardProofPreview');
    expect(dashboardWidgetStage).toContain('useViewportGate');
    expect(dashboardWidgetStage).toContain('setInterval');
  });

  it('uses app-screen assets for landing product proof sections', () => {
    const proofFiles = [
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

  it('keeps all real app media clipped inside reusable phone mockups', () => {
    const phoneShowcase = readFileSync(
      path.join(ROOT, 'components/ui/PhoneShowcase.tsx'),
      'utf8'
    );
    const css = readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');

    expect(phoneShowcase).toContain('phone-showcase__media');
    expect(css).toContain('.phone-showcase__media');
    expect(css).toContain('object-fit: cover;');
    expect(css).toContain('object-position: top center;');
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
    expect(heroCopy).toContain('Follow every team, rate live games, and keep your crew in the same feed.');
    expect(heroCopy).toContain('<h1 id="hero-title" className="sr-only">');
    expect(heroCopy).toContain('viewBox="0 0 560 560"');
    expect(heroCopy).toContain('hero-encircle');
    expect(heroCopy).toContain('The home for all');
    expect(heroCopy).toContain('sports fans.');
    expect(heroCopy).not.toContain('HERO_TRUST_ITEMS');
    expect(heroCopy).not.toContain('hero-product-proof');
    expect(heroCopy).not.toContain('hero-product-promise');
    expect(heroCopy).not.toContain('Follow teams. Rate games. Chat live.');
    expect(heroCopy).toContain('bottom-[14vh]');
    expect(heroCopy).toContain('flex-col items-center justify-center gap-2 px-4 sm:bottom-[12vh] sm:flex-row sm:gap-3 sm:px-6');
    expect(heroCopy).toContain('px-4 py-3 text-[14px]');
    expect(heroCopy).toContain('sm:px-5 sm:text-[15px]');
    expect(heroCopy).toContain('w-[168px] items-center justify-center');
    expect(heroCopy).toContain('sm:w-auto');
    expect(heroCopy).not.toContain('AI-Native');
    expect(heroCopy).not.toContain('The AI-native home for sports fans.');
  });

  it('moves AI Feed out of the top nav and keeps product anchors focused', () => {
    const header = readFileSync(path.join(ROOT, 'components/SiteHeader.tsx'), 'utf8');

    expect(header).toContain("label: 'Scroll'");
    expect(header).toContain("label: 'Friends'");
    expect(header).toContain("label: 'Leagues'");
    expect(header).toContain("label: 'Bets'");
    expect(header).not.toContain("label: 'Dashboards'");
    expect(header).not.toContain("label: 'AI'");
    expect(header).not.toContain("id: 'mission'");
  });

  it('uses the glass Buzzr bento with rendered proof cards and no Scroll card', () => {
    const surfacesGrid = readFileSync(
      path.join(ROOT, 'components/sections/SurfacesGrid.tsx'),
      'utf8'
    );

    for (const label of ['Dashboards For Every Team', 'Friends And Chat', 'League Map', 'Fan Signals', 'Buzzr Bets']) {
      expect(surfacesGrid).toContain(label);
    }

    expect(surfacesGrid).toContain('Your Sports, Sorted');
    expect(surfacesGrid).not.toContain('Tailor the Buzz');
    expect(surfacesGrid).not.toContain('/promo/buzzr-dashboard.mp4');
    expect(surfacesGrid).not.toContain('/promo/buzzr-friends.mp4');
    expect(surfacesGrid).not.toContain('/promo/buzzr-bets.mp4');
    expect(surfacesGrid).not.toContain('LazyMotionPreview');
    expect(surfacesGrid).toContain('EmojiBurst');
    expect(surfacesGrid).toContain('DashboardProofPreview');
    expect(surfacesGrid).toContain('LeagueSortPreview');
    expect(surfacesGrid).toContain('LeagueChipLogo');
    expect(surfacesGrid).toContain('getLeagueLogo');
    expect(surfacesGrid).toContain('isRemoteLeagueLogo');
    expect(surfacesGrid).toContain('ChatProofPreview');
    expect(surfacesGrid).toContain('BetsSlipPreview');
    expect(surfacesGrid).toContain('FanSignalsPreview');
    expect(surfacesGrid).not.toContain('LeaguePreviewMark');
    expect(surfacesGrid).not.toContain('LeaguePreviewKind');
    expect(surfacesGrid).not.toContain('01 Scroll');
    expect(surfacesGrid).not.toContain('/promo/buzzr-scroll.mp4');
    expect(surfacesGrid).not.toContain('RealAppPreview');
    expect(surfacesGrid).not.toContain('VideoAppPreview');
    expect(surfacesGrid).not.toContain('PhoneShowcase');
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

  it('mounts the Stay Buzzed In carousel from dedicated media paths', () => {
    const page = readFileSync(path.join(ROOT, 'app/page.tsx'), 'utf8');
    const promo = readFileSync(
      path.join(ROOT, 'components/sections/PromoReels.tsx'),
      'utf8'
    );

    expect(page).toContain('<PromoReels />');
    expect(promo).toContain('/promo/ios-rate-game-2x.mp4');
    expect(promo).toContain('/promo/ios-dashboard-2x.mp4');
    expect(promo).toContain('/promo/ios-feed-2x.mp4');
    expect(promo).toContain('/promo/ios-leagues-2x.mp4');
    expect(promo).toContain('/promo/ios-message-2x.mp4');
    expect(promo).toContain('/app-screens/ios-rate-saved.png');
    expect(promo).toContain('Stay Buzzed In');
    expect(promo).toContain('function BeeIcon');
    expect(promo).toContain('promo-carousel');
    expect(promo).toContain('aria-label="Previous Buzzr motion card"');
    expect(promo).toContain('aria-label="Next Buzzr motion card"');
    expect(promo).toContain('Rate Games While They Are Live');
    expect(promo).toContain('Message Takes Before They Cool');
    expect(promo).not.toContain('Actual signed-in Buzzr captures');
    expect(promo).not.toContain('Rate the game while the moment is still fresh.');
    expect(promo).not.toContain('Send the take before the group chat catches up.');
    expect(promo).toContain('LazyPhoneVideo');
    expect(promo).not.toContain('<video');
  });

  it('removes the diagonal app gallery before the final CTA', () => {
    const page = readFileSync(path.join(ROOT, 'app/page.tsx'), 'utf8');
    const css = readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');

    expect(page).not.toContain('<AppGallery />');
    expect(page).not.toContain("from '@/components/sections/AppGallery'");
    expect(css).not.toContain('diagonal-gallery');
  });

  it('keeps the landing video and scroll phone gated to the hero viewport', () => {
    const clayHero = readFileSync(path.join(ROOT, 'components/ui/ClayHero.tsx'), 'utf8');
    const videoBackdrop = readFileSync(
      path.join(ROOT, 'components/ui/VideoBackdrop.tsx'),
      'utf8'
    );
    const lazyPhoneVideo = readFileSync(
      path.join(ROOT, 'components/ui/LazyPhoneVideo.tsx'),
      'utf8'
    );
    const surfacesGrid = readFileSync(
      path.join(ROOT, 'components/sections/SurfacesGrid.tsx'),
      'utf8'
    );
    const clayHeroScene = readFileSync(
      path.join(ROOT, 'components/ui/ClayHeroScene.tsx'),
      'utf8'
    );

    expect(clayHero).toContain('useViewportGate');
    expect(clayHero).toContain('defaultActive: true');
    expect(clayHero).toContain("rootMargin: '320px 0px 900px 0px'");
    expect(clayHero).toContain('heroReleaseTopPx = 320');
    expect(clayHero).toContain('heroPreloadBottomPx = 900');
    expect(clayHero).toContain('setHeroScrollActive');
    expect(clayHero).toContain("window.addEventListener('scroll', updateHeroScrollActive");
    expect(clayHero).toContain('data-hero-active');
    expect(clayHero).toContain('{isHeroActive ?');
    expect(clayHero).toContain('VideoBackdrop');
    expect(clayHero).toContain('active={isHeroActive}');
    expect(clayHero).toContain('hero-ambient-field');
    expect(videoBackdrop).toContain("src = '/molten-flux.mp4'");
    expect(videoBackdrop).toContain('active = true');
    expect(videoBackdrop).toContain('shouldLoad');
    expect(lazyPhoneVideo).toContain('useViewportGate');
    expect(lazyPhoneVideo).toContain('data-lazy-phone-video');
    expect(surfacesGrid).not.toContain('LazyMotionPreview');
    expect(surfacesGrid).not.toContain('<video');
    expect(clayHeroScene).toContain('HERO_BANDS.burstFade');
    expect(clayHeroScene).toContain('ball.visible = ballFade < 0.985');
    expect(clayHeroScene).toContain('isNarrow ? -0.08 : 0.12');
    expect(clayHeroScene).toContain('isNarrow ? 0.72 : 0.82');
  });

  it('keeps the landing sections blended without a blank hero handoff shelf', () => {
    const page = readFileSync(path.join(ROOT, 'app/page.tsx'), 'utf8');
    const clayHero = readFileSync(path.join(ROOT, 'components/ui/ClayHero.tsx'), 'utf8');
    const scrollReveal = readFileSync(path.join(ROOT, 'components/ScrollReveal.tsx'), 'utf8');
    const surfacesGrid = readFileSync(
      path.join(ROOT, 'components/sections/SurfacesGrid.tsx'),
      'utf8'
    );
    const css = readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');

    expect(clayHero).toContain('h-[155vh] md:h-[165vh]');
    expect(clayHero).not.toContain('h-[200vh]');
    expect(page).toContain('landing-section-reveal landing-section-reveal--first');
    expect(page).toContain('landing-section-reveal');
    expect(scrollReveal).toContain("containIntrinsicSize: inView ? undefined : '560px'");
    expect(surfacesGrid).toContain('pt-10 pb-14 md:pt-14 md:pb-20');
    expect(css).toContain('.landing-section-reveal--first');
    expect(css).toContain('margin-top: clamp(-260px, -18vh, -150px);');
    expect(css).toContain('.landing-section-reveal::before');
    expect(css).not.toContain('.hero-product-proof');
  });

  it('uses install trust proof in the final app CTA', () => {
    const finalCta = readFileSync(path.join(ROOT, 'components/sections/FinalCTA.tsx'), 'utf8');

    expect(finalCta).toContain('Free on iOS');
    expect(finalCta).toContain('5.0 App Store rating');
    expect(finalCta).toContain('11 ratings');
    expect(finalCta).toContain('49 leagues');
    expect(finalCta).toContain('Follow teams, rate games, and keep the crew close.');
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
