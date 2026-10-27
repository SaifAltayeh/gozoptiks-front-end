import { BrandGrid } from "@/frontend/brand-grid";
import { loadCatalog } from "@/frontend/catalog";

export const metadata = {
  title: "Brands",
};

export default async function BrandsPage() {
  await loadCatalog();
  return (
    <div className="page">
      <header className="shop-head" data-reveal>
        <h1 className="shop-title">Brands</h1>
      </header>
      <BrandGrid />
    </div>
  );
}
