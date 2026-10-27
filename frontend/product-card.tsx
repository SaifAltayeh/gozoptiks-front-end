"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/models";
import { getBrandName } from "@/frontend/catalog";
import { useCart } from "@/frontend/cart-context";
import { PriceDisplay } from "@/frontend/price-display";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const brand = getBrandName(product.brandId);
  const available = product.stockStatus === "in_stock";
  const needsVariant = product.variations.some((item) => item.options.length > 1);
  const defaultVariant = product.variations[0]?.options.find((option) => option.available)?.id ?? null;

  return (
    <article className="product-card">
      <div className="product-card-media">
        <Link href={`/products/${product.slug}`} aria-label={`${brand} ${product.name}`}>
          <Image
            className={`primary ${product.hoverImage ? "has-alt" : ""}`}
            src={product.images[0]}
            alt={`${brand} ${product.name}`}
            width={576}
            height={768}
            sizes="(max-width: 860px) 50vw, 25vw"
          />
          {product.hoverImage ? (
            <Image className="alt" src={product.hoverImage} alt="" width={576} height={768} sizes="(max-width: 860px) 50vw, 25vw" />
          ) : null}
        </Link>
        {available && !needsVariant ? (
          <button
            className="quick-add"
            type="button"
            onClick={() => addItem({ product, quantity: 1, variantId: defaultVariant })}
          >
            Add to cart
          </button>
        ) : (
          <Link href={`/products/${product.slug}`} className="quick-add" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {available ? "Select options" : "View details"}
          </Link>
        )}
      </div>
      <div className="product-card-meta">
        <p className="product-card-brand">{brand}</p>
        <Link href={`/products/${product.slug}`} className="product-card-name">
          {product.name}
        </Link>
        <PriceDisplay price={product.price} originalPrice={product.originalPrice} />
        {!available ? <p className="stock-tag">Unavailable</p> : null}
      </div>
    </article>
  );
}
