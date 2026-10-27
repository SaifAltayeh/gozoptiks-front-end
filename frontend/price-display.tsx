import { formatPrice } from "@/frontend/format";

export function PriceDisplay({
  price,
  originalPrice,
}: {
  price: number;
  originalPrice?: number;
}) {
  const showOriginal = originalPrice && originalPrice > price;
  return (
    <p className="product-card-price">
      {formatPrice(price)}
      {showOriginal ? (
        <>
          {" "}
          <s className="muted">{formatPrice(originalPrice)}</s>
        </>
      ) : null}
    </p>
  );
}
