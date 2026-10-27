import { notFound } from "next/navigation";
import { ProductDetail } from "@/frontend/product-detail";
import { getProductBySlug, getProducts, loadCatalog } from "@/frontend/catalog";

export async function generateStaticParams() {
  await loadCatalog();
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await loadCatalog();
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  await loadCatalog();
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
