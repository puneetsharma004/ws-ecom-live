import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/store/NewsletterForm";
import { ProductCard } from "@/components/store/ProductCard";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn.js";
import { getFeaturedProducts } from "@/lib/db/catalog";

// ISR: cache the home page, refresh featured products every 5 minutes.
export const revalidate = 300;

// Marketing imagery from the supplied designs. TODO: replace with owned assets
// hosted in Supabase Storage before launch.
const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAmGXv_RYAkXMcIaYBWmFk22frkZavgNj2OcZmtRlPKHFHrbEVvhZf5No2xwDLztApWypTfFV29yWvaBGKRFCVfZn4RCeb43lPS_Z0YCyAd9wjISyZeEKSsRb9tiGh9iQ3n7CpqlI9eBcugeNx_H6LHdN-hj-BraEnR6LHcD-YLJF2JrMUbHORi1evrBtkpV7aope9SzunUOG-bKk3fMamHCx5FtfWMhzJh_R9z4b1s3UEkfT-krJ_nLPsAbsh9g3v0rjN6DiUlhaI";

const categories = [
  {
    name: "T-Shirts",
    blurb: "Breathable performance fabrics.",
    slug: "t-shirts",
    wide: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuARmttM1PM_UN2T2axtirNBDNUqWAc_JMn9L8Ry8uCKsWL9qLRpdcf4jx3V74O1BBT7YhLXcgmFofmOg9i6Sa6K3iF05GL52hDvfoQ1gaXlStGQNvL2zV03eVKTGcMyKwW5XBBpV3_8HeeBTVAhiw1xc1ZOQrtYr1tw011EIVPZB9i6vG6yMkOW2rHq2376bJlb-y8cfAsxdou_5cW64kg3xl6iu7AtOdiuIrPN8ohphDlqHLaeN4QRqUIPaX-Qx3ontEg6SysmLjw",
  },
  {
    name: "Backpacks",
    blurb: "Engineered storage.",
    slug: "backpacks",
    wide: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIS2HYBxg5ftDFqiKoLzezfNOr5ZIEbd9ZGQ7XCmq4HUgMsIO56yhJrQygyt5Xo60_6YCTT_YTJYAk5P9dXQlHUv-oZ-VPvY5xlrPU_yrjZEZFfBk0UpybR-dJxrg_otVGHJgpSiUfJRYWBcBoCzvo3jWenfb5CZBMf5jhgy5AbzYturgR7nzwe1rQrB4W0RZaDN8nSPIjZdk9wRdrMSW80tqzaUpwx1HD9OpkpHLyEoATxvCiJ3y9ypIQ5YPWa4tO0BYYpvNiicU",
  },
  {
    name: "Hoodies",
    blurb: "Structured warmth.",
    slug: "hoodies",
    wide: false,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1TUVlClelJRmbw-2JXTSXBVudGxur84JoD26s3mCJff7MDw9mLa2GYtF99J0yBCOxMh4YBeZkfLsmZRLVeCs9Ayhz_-vUosE4Kj4XsCFkZhv6x5bXEoifikXWVIzBnbMwxh4SxlkZNDdkgZhcEovN8IPEsFGrcRLLQWUaLLKP4mGQk1LROeDevZY4-mk7nTnyZZF2NtVJn7D3GKKAYifJlvK4zP9FTNKaJ9Dd2r7K3g8Xe5G0-I-B1iAR8rC-91qALd__KiU3Afw",
  },
  {
    name: "Tech Accessories",
    blurb: "Seamless integration.",
    slug: "tech-accessories",
    wide: true,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCe5nZTl-qwo9yYai3HPQBBpGNfQr6YFbTx01h12msg2UcBeLy0PgSD5A5ZvdQVjkq_S0Iu3ZuNWAf-vQdpTkb5P7UmlDS2bhw3fPzPX5KUO77bQoK9FdOe27GN-cVwzEM8yk_zK3wwSRQPKqaHg-epjNrMqqzSN8bljgAozDw23RPKQRRC5xXNLP613p7FWcMog_C5m2ERMNzcVlTKuQ-jNR6Srl6c7GfVqPCYTerpU-vVl9ZzLFJwZKckSM07y5Z12_MWi7-waqc",
  },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts(4);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[640px] md:min-h-[760px] flex items-center justify-center px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={HERO_IMG}
            alt="WS CubeTech premium tech apparel and accessories"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-container-max mx-auto text-center">
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-stack-md tracking-tight">
            Engineered for Innovation.
            <br />
            Styled for You.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-stack-lg">
            Discover precision-crafted apparel and accessories designed for the
            modern tech professional. Form meets function in every thread.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-stack-sm">
            <Link
              href="/shop"
              className={buttonClasses({
                variant: "primary",
                size: "md",
                className: "rounded-full w-full sm:w-auto",
              })}
            >
              Shop Collection
            </Link>
            <Link
              href="/shop"
              className={buttonClasses({
                variant: "glass",
                size: "md",
                className: "rounded-full w-full sm:w-auto",
              })}
            >
              View Lookbook
              <Icon name="arrow_forward" className="text-[18px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured categories (bento grid) */}
      <section className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-stack-lg">
            <h2 className="font-headline-xl text-headline-xl text-primary">
              Essentials
            </h2>
            <Link
              href="/shop"
              className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
            >
              View All <Icon name="chevron_right" className="text-[16px]" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter auto-rows-[300px]">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={cn(
                  "relative rounded-xl overflow-hidden group cursor-pointer",
                  cat.wide && "md:col-span-2",
                )}
              >
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 cubic-transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-stack-md w-full">
                  <h3 className="font-headline-lg text-headline-lg text-on-primary mb-stack-xs">
                    {cat.name}
                  </h3>
                  <p className="font-body-md text-body-md text-surface-dim">
                    {cat.blurb}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-container-max mx-auto">
            <div className="flex justify-between items-end mb-stack-lg">
              <h2 className="font-headline-xl text-headline-xl text-primary">
                Featured
              </h2>
              <Link
                href="/shop"
                className="font-label-md text-label-md text-secondary hover:underline flex items-center gap-1"
              >
                Shop all <Icon name="chevron_right" className="text-[16px]" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-surface">
        <div className="max-w-3xl mx-auto text-center glass-panel p-stack-xl rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <Icon
            name="all_inclusive"
            className="text-[48px] text-secondary mb-stack-sm"
          />
          <h2 className="font-headline-xl text-headline-xl text-primary mb-stack-sm">
            Join the Network
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-stack-lg">
            Subscribe for early access to new drops, exclusive engineering
            insights, and tech-forward lifestyle content.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
