"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/models";
import { getBrandName, getRelatedProducts, getVariationState } from "@/frontend/catalog";
import { useCart } from "@/frontend/cart-context";
import { ProductGallery } from "@/frontend/product-gallery";
import { ColorSiblings } from "@/frontend/color-siblings";
import { ProductVariations } from "@/frontend/product-variations";
import { QuantitySelector } from "@/frontend/quantity-selector";
import { AddToCartButton } from "@/frontend/add-to-cart-button";
import { PriceDisplay } from "@/frontend/price-display";
import { ProductGrid } from "@/frontend/product-grid";
import { Breadcrumbs } from "@/frontend/breadcrumbs";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const brand = getBrandName(product.brandId);
  const related = getRelatedProducts(product);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const variation of product.variations) {
      const first = variation.options.find((option) => option.available) ?? variation.options[0];
      if (first) initial[variation.id] = first.id;
    }
    return initial;
  });

  const variantId = selected.color ?? Object.values(selected)[0] ?? null;
  const state = useMemo(() => getVariationState(product, variantId), [product, variantId]);
  const max = state.stockQuantity ?? 99;
  const needsChoice = product.variations.some((item) => item.options.length > 1) && !variantId;

  return (
    <div className="page pdp-page">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.name },
        ]}
      />
      <div className="pdp" data-reveal>
        <ProductGallery images={state.images} alt={`${brand} ${product.name}`} />
        <div className="pdp-info">
          <p className="kicker">{brand}</p>
          <h1 className="pdp-title">{product.name}</h1>
          <div className="pdp-price">
            <PriceDisplay price={state.price} originalPrice={product.originalPrice} />
          </div>
          <p className="pdp-desc">{product.description}</p>
          <p className="pdp-stock">{state.available ? "In stock" : "Unavailable"}</p>
          {product.modelId ? (
            <ColorSiblings product={product} />
          ) : (
            <ProductVariations
              variations={product.variations}
              selected={selected}
              onSelect={(variationId, optionId) => setSelected((current) => ({ ...current, [variationId]: optionId }))}
            />
          )}
          <div className="buy-row">
            <QuantitySelector value={quantity} min={1} max={Math.max(1, max)} onChange={setQuantity} labelledBy="qty" />
            <AddToCartButton
              disabled={!state.available || needsChoice}
              label={!state.available ? "Unavailable" : needsChoice ? "Select a variation" : "Add to cart"}
              onClick={() => addItem({ product, quantity, variantId })}
            />
          </div>
          {product.attributes.length ? (
            <dl className="specs">
              {product.attributes.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <Link href="/shop" className="text-link">
            Continue shopping
          </Link>
        </div>
      </div>
      {related.length ? (
        <section className="pdp-related shop">
          <div className="section-head" data-reveal>
            <h2 className="section-title">You may also like</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  );
}
