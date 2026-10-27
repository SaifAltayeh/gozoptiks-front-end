import type { Product } from "@/lib/models";
import { ProductCard } from "@/frontend/product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="empty" data-reveal>
        <h2 className="section-title">No frames match these filters.</h2>
        <p className="muted">Clear filters or browse the full shop.</p>
      </div>
    );
  }

  return (
    <div className="product-grid" data-reveal data-reveal-stagger>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
