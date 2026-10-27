import Link from "next/link";
import type { HomepageSection } from "@/lib/models";
import { getProductsByIds } from "@/frontend/catalog";
import { ProductGrid } from "@/frontend/product-grid";

export function ProductSection({ section }: { section: HomepageSection }) {
  const products = getProductsByIds(section.productIds ?? []);
  if (!products.length) return null;

  return (
    <section className="section">
      <div className="section-head" data-reveal>
        <div>
          <h2 className="section-title">{section.title}</h2>
          {section.description ? <p>{section.description}</p> : null}
        </div>
        {section.ctaHref && section.ctaLabel ? (
          <Link href={section.ctaHref} className="text-link">
            {section.ctaLabel}
          </Link>
        ) : null}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
