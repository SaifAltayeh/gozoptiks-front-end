import { Suspense } from "react";
import { ListingView } from "@/frontend/listing-view";
import { getProducts, loadCatalog } from "@/frontend/catalog";

export const metadata = {
  title: "Shop",
};

export default async function ShopPage() {
  await loadCatalog();
  const products = getProducts();
  return (
    <div className="page">
      <Suspense>
        <ListingView products={products} title="Shop" kicker="Catalog" />
      </Suspense>
    </div>
  );
}
