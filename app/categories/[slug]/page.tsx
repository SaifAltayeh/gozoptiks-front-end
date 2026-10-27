import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/frontend/breadcrumbs";
import { ListingView } from "@/frontend/listing-view";
import { getCategories, getCategoryBySlug, getProducts, loadCatalog } from "@/frontend/catalog";

export async function generateStaticParams() {
  await loadCatalog();
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCatalog();
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  return { title: category.name };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCatalog();
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();
  const products = getProducts().filter((product) => product.categoryIds.includes(category.id));

  return (
    <div className="page">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: category.name }]}
      />
      <Suspense>
        <ListingView products={products} title={category.name} description={category.description} />
      </Suspense>
    </div>
  );
}
