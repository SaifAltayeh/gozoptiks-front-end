import Link from "next/link";
import type { Product } from "@/lib/models";
import { getModelSiblings } from "@/frontend/catalog";

function colorLabel(product: Product) {
  return product.attributes.find((item) => item.label === "Color")?.value ?? product.name;
}

export function ColorSiblings({ product }: { product: Product }) {
  const siblings = getModelSiblings(product);
  if (siblings.length < 2) return null;

  return (
    <div className="pdp-variants">
      <div className="pdp-variant-group">
        <p className="kicker">Color</p>
        <div className="variant-row">
          {siblings.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.slug}`}
              className="variant"
              aria-current={item.id === product.id ? "page" : undefined}
            >
              {colorLabel(item)}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
