"use client";

import { MediaImage as Image } from "@/frontend/media-image";
import Link from "next/link";
import type { CartItem as CartItemType } from "@/lib/models";
import { formatPrice } from "@/frontend/format";
import { QuantitySelector } from "@/frontend/quantity-selector";

type Props = {
  item: CartItemType;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItem({ item, onQuantity, onRemove }: Props) {
  return (
    <article className="cart-line">
      <Link href={`/products/${item.slug}`} className="cart-line-media">
        <Image src={item.image} alt={item.name} width={160} height={214} />
      </Link>
      <div className="cart-line-body">
        <div className="cart-line-top">
          <div>
            <p className="product-card-brand">{item.brandName}</p>
            <Link href={`/products/${item.slug}`} className="product-card-name">
              {item.name}
            </Link>
            {item.variantLabel ? <p className="small">{item.variantLabel}</p> : null}
          </div>
          <p className="cart-line-price">{formatPrice(item.unitPrice * item.quantity)}</p>
        </div>
        <div className="cart-line-actions">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={item.stockQuantity ?? 99}
            onChange={onQuantity}
            labelledBy={`${item.key}-qty`}
          />
          <button className="remove" type="button" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
