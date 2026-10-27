"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getStore } from "@/frontend/catalog";
import { useCart } from "@/frontend/cart-context";
import { formatPrice } from "@/frontend/format";
import type { Order } from "@/lib/models";
import { EmptyState } from "@/frontend/empty-state";
import { OrderSummary } from "@/frontend/order-summary";

export function OrderConfirmationView() {
  const store = getStore();
  const params = useSearchParams();
  const { readOrder } = useCart();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    setOrder(readOrder());
  }, [readOrder]);

  if (!order) {
    return (
      <EmptyState
        title="No demo order found."
        text="Place a guest checkout to generate a local demonstration reference."
        href="/shop"
        cta="Shop frames"
      />
    );
  }

  const ref = params.get("ref");

  return (
    <div className="checkout" data-reveal>
      <div>
        <p className="kicker">Payment pending</p>
        <h1 className="display">Request recorded</h1>
        <p className="body-lg" style={{ margin: "1rem 0 1.5rem" }}>
          This is a local demonstration order. Visa has not been charged, inventory has not been updated, and no confirmation email has been sent.
        </p>
        <div className="confirm-card">
          <p>
            <strong>Reference</strong> {order.reference}
            {ref && ref !== order.reference ? ` (URL: ${ref})` : ""}
          </p>
          <p>
            <strong>Payment</strong> {order.paymentStatus} · {order.paymentMethod.toUpperCase()}
          </p>
          <p>
            <strong>Order status</strong> {order.orderStatus.replace(/_/g, " ")}
          </p>
          <p>
            <strong>Total</strong> {formatPrice(order.total)}
          </p>
          <p>
            <strong>Ship to</strong> {order.customer.fullName}, {order.delivery.street}, {order.delivery.area}, {order.delivery.city}
          </p>
          <p>
            <strong>Contact</strong> {order.customer.email} · {order.customer.phone}
          </p>
          <p>
            <strong>Shipping</strong> {order.shippingMethodName} · {formatPrice(order.shippingFee)}
          </p>
        </div>
        <p className="note" style={{ marginTop: "1.25rem" }}>
          {store.email.note}
        </p>
      </div>
      <OrderSummary
        items={order.items}
        subtotal={order.subtotal}
        shippingFee={order.shippingFee}
        shippingName={order.shippingMethodName}
        total={order.total}
      />
    </div>
  );
}
