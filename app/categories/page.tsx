import { MediaImage as Image } from "@/frontend/media-image";
import Link from "next/link";
import { getCategories, loadCatalog } from "@/frontend/catalog";

export const metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  await loadCatalog();
  const categories = getCategories();

  return (
    <div className="page">
      <header className="shop-head" data-reveal>
        <h1 className="shop-title">Categories</h1>
      </header>
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
    </div>
  );
}
