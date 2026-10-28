import { MediaImage as Image } from "@/frontend/media-image";
import type { CartItem } from "@/lib/models";
import { formatPrice } from "@/frontend/format";

export function OrderSummary({
  items,
  subtotal,
  shippingFee,
  shippingName,
  total,
}: {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  shippingName?: string;
  total: number;
}) {
  return (
    <aside className="summary">
      <h2>Order summary</h2>
      <div className="cart-items">
        {items.map((item) => (
          <article key={item.key} className="cart-line">
            <Image src={item.image} alt={item.name} width={84} height={112} />
            <div>
              <p className="product-card-brand">{item.brandName}</p>
              <p className="product-card-name">{item.name}</p>
              {item.variantLabel ? <p className="small">{item.variantLabel}</p> : null}
              <p className="small">
                Qty {item.quantity} · {formatPrice(item.unitPrice * item.quantity)}
              </p>
            </div>
          </article>
        ))}
      </div>
      <div className="totals" style={{ marginTop: "1rem" }}>
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      <div className="totals">
        <span>{shippingName ?? "Shipping"}</span>
        <span>{formatPrice(shippingFee)}</span>
      </div>
      <div className="totals" style={{ fontWeight: 500, marginTop: "0.4rem" }}>
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </aside>
  );
}
