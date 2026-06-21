import Image from 'next/image';

const PRODUCT_HUNT_URL =
  'https://www.producthunt.com/products/buzzr-sports?embed=true&utm_source=embed&utm_medium=post_embed';

const PRODUCT_HUNT_IMAGE_URL =
  'https://ph-files.imgix.net/994a904c-7028-484e-a160-87e2af3ce332.png?auto=format&fit=crop&w=80&h=80';

export function ProductHuntLaunchEmbed() {
  return (
    <aside
      aria-label="Buzzr Product Hunt launch"
      className="mx-auto w-full max-w-[1200px] px-6 pt-10"
    >
      <div
        className="w-full max-w-[500px] rounded-2xl border border-[#e0e0e0] bg-white p-5 text-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:ml-auto"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}
      >
        <div className="mb-3 flex items-center gap-3">
          <Image
            alt="Buzzr Sports"
            src={PRODUCT_HUNT_IMAGE_URL}
            width={64}
            height={64}
            className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold leading-[1.3] text-[#1a1a1a]">
              Buzzr Sports
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-[1.4] text-[#666666]">
              Rate live games, make picks, and follow fan buzz
            </p>
          </div>
        </div>
        <a
          href={PRODUCT_HUNT_URL}
          target="_blank"
          rel="noopener"
          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[#ff6154] px-4 py-2 text-sm font-semibold text-white no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline-[#ff6154]"
        >
          Check it out on Product Hunt <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </aside>
  );
}
