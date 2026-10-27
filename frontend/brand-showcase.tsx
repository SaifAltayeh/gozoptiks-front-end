import Link from "next/link";
import { BrandGrid } from "@/frontend/brand-grid";
import type { HomepageSection } from "@/lib/models";

export function BrandShowcase({ section }: { section?: HomepageSection }) {
  return (
    <section className="section">
      <div className="section-head" data-reveal>
        <div>
          <h2 className="section-title">{section?.title || "Shop by brand"}</h2>
          {section?.description ? <p>{section.description}</p> : null}
        </div>
        <Link href={section?.ctaHref || "/brands"} className="text-link">
          {section?.ctaLabel || "All brands"}
        </Link>
      </div>
      <BrandGrid brandIds={section?.brandIds} />
    </section>
  );
}
