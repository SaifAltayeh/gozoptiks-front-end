import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/frontend/breadcrumbs";
import { ListingView } from "@/frontend/listing-view";
import { getBrandBySlug, getBrands, getProducts, loadCatalog } from "@/frontend/catalog";

export async function generateStaticParams() {
  await loadCatalog();
  return getBrands().map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCatalog();
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();
  return { title: brand.name };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCatalog();
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();
  const products = getProducts().filter((product) => product.brandId === brand.id);

  return (
    <div className="page">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Brands", href: "/brands" }, { label: brand.name }]} />
      <Suspense>
        <ListingView products={products} title={brand.name} description={brand.description} />
      </Suspense>
    </div>
  );
}
