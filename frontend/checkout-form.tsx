"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getStore } from "@/frontend/catalog";
import { useCart } from "@/frontend/cart-context";
import { createDemoOrder, validateCheckout } from "@/frontend/checkout";
import { money } from "@/frontend/format";
import { FormField } from "@/frontend/form-field";
import { ShippingSelector } from "@/frontend/shipping-selector";
import { OrderSummary } from "@/frontend/order-summary";
import { EmptyState } from "@/frontend/empty-state";
import type { CheckoutErrors } from "@/frontend/checkout";

export function CheckoutForm() {
  const store = getStore();
  const router = useRouter();
  const { items, subtotal, clearCart, saveOrder, ready } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [shippingMethodId, setShippingMethodId] = useState(store.shippingMethods[0]?.id ?? "");
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [customer, setCustomer] = useState({ fullName: "", email: "", phone: "" });
  const [delivery, setDelivery] = useState({
    country: "",
    city: "",
    area: "",
    street: "",
    building: "",
    instructions: "",
  });

  const shipping = store.shippingMethods.find((method) => method.id === shippingMethodId);
  const shippingFee = money(shipping?.fee ?? 0);
  const total = money(subtotal + shippingFee);

  const customerFields = useMemo(
    () =>
      [
        ["fullName", "Full name", "text"],
        ["email", "Email", "email"],
        ["phone", "Phone", "tel"],
      ] as const,
    [],
  );

  if (!ready) {
    return (
      <div className="page">
        <h1 className="display">Checkout</h1>
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState title="Your cart is empty." text="Add a frame before checking out." href="/shop" cta="Shop frames" />;
  }

  function updateCustomer(key: keyof typeof customer, value: string) {
    setCustomer((current) => ({ ...current, [key]: value }));
  }

  function updateDelivery(key: keyof typeof delivery, value: string) {
    setDelivery((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateCheckout({ customer, delivery, shippingMethodId, paymentMethod });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const order = createDemoOrder({
      customer,
      delivery,
      items,
      shippingMethodId,
      paymentMethod,
    });
    saveOrder(order);
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    clearCart();
    router.push(`/order-confirmation?ref=${encodeURIComponent(order.reference)}`);
  }

  return (
    <form className="checkout" onSubmit={onSubmit} noValidate data-reveal>
      <div className="form">
        <h1 className="display">Checkout</h1>
        <p className="muted">Guest checkout. No account is required.</p>

        <h2 className="section-title" style={{ fontSize: "1.35rem", marginTop: "1rem" }}>
          Contact
        </h2>
        {customerFields.map(([key, label, type]) => (
          <FormField key={key} id={key} label={label} error={errors[key]}>
            <input
              id={key}
              name={key}
              type={type}
              autoComplete={key === "fullName" ? "name" : key}
              value={customer[key]}
              onChange={(event) => updateCustomer(key, event.target.value)}
              aria-invalid={Boolean(errors[key])}
            />
          </FormField>
        ))}

        <h2 className="section-title" style={{ fontSize: "1.35rem", marginTop: "0.5rem" }}>
          Delivery
        </h2>
        <div className="form-grid">
          <FormField id="country" label="Country" error={errors.country}>
            <input id="country" value={delivery.country} onChange={(event) => updateDelivery("country", event.target.value)} />
          </FormField>
          <FormField id="city" label="City" error={errors.city}>
            <input id="city" value={delivery.city} onChange={(event) => updateDelivery("city", event.target.value)} />
          </FormField>
        </div>
        <FormField id="area" label="Area / neighborhood" error={errors.area}>
          <input id="area" value={delivery.area} onChange={(event) => updateDelivery("area", event.target.value)} />
        </FormField>
        <FormField id="street" label="Street address" error={errors.street}>
          <input id="street" value={delivery.street} onChange={(event) => updateDelivery("street", event.target.value)} />
        </FormField>
        <FormField id="building" label="Building / apartment">
          <input id="building" value={delivery.building} onChange={(event) => updateDelivery("building", event.target.value)} />
        </FormField>
        <FormField id="instructions" label="Delivery notes">
          <textarea
            id="instructions"
            value={delivery.instructions}
            onChange={(event) => updateDelivery("instructions", event.target.value)}
          />
        </FormField>

        <ShippingSelector value={shippingMethodId} onChange={setShippingMethodId} error={errors.shippingMethodId} />

        <fieldset style={{ border: 0, padding: 0 }}>
          <legend className="kicker">Payment</legend>
          {store.payment.methods.map((method) => (
            <label key={method.id} className="pay-option">
              <input
                type="radio"
                name="payment"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={() => setPaymentMethod(method.id)}
              />
              <span>
                <strong style={{ fontWeight: 500 }}>{method.label}</strong>
                <span className="small" style={{ display: "block" }}>
                  {method.description}
                </span>
              </span>
            </label>
          ))}
          {errors.paymentMethod ? (
            <p className="error" role="alert">
              {errors.paymentMethod}
            </p>
          ) : null}
        </fieldset>

        <p className="note">{store.payment.note}</p>
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Recording order…" : "Place order request"}
        </button>
      </div>
      <OrderSummary
        items={items}
        subtotal={subtotal}
        shippingFee={shippingFee}
        shippingName={shipping?.name}
        total={total}
      />
    </form>
  );
}
