import Image from "next/image";
import Link from "next/link";
import { getCategories, getFeaturedCategories } from "@/frontend/catalog";
import type { HomepageSection } from "@/lib/models";

export function CategoryShowcase({ section }: { section?: HomepageSection }) {
  const title = section?.title || "Shop by category";
  const all = getCategories();
  const featured = getFeaturedCategories();
  const selected = section?.categoryIds?.length
    ? section.categoryIds.map((id) => all.find((category) => category.id === id)).filter(Boolean)
    : featured;
  const categories = (selected.length ? selected : featured) as typeof all;
  const ctaLabel = section?.ctaLabel || "All categories";
  const ctaHref = section?.ctaHref || "/categories";

  if (!categories.length) return null;

  return (
    <section className="section">
      <div className="section-head" data-reveal>
        <div>
          <h2 className="section-title">{title}</h2>
          {section?.description ? <p>{section.description}</p> : null}
        </div>
        <Link href={ctaHref} className="text-link">
          {ctaLabel}
        </Link>
      </div>
      <div className="category-row" data-reveal data-reveal-stagger>
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.slug}`} className="category-item">
            <span className="category-item-media">
              <Image src={category.image} alt="" fill sizes="(max-width: 860px) 50vw, 33vw" />
            </span>
            <span className="category-item-meta">
              <span className="category-item-name">{category.name}</span>
              <span className="category-item-cta">Shop</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
