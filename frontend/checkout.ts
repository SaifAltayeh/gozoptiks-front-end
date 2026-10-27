import { getStore } from "@/frontend/catalog";
import { money } from "@/frontend/format";
import type { CartItem, Order, OrderCustomer, OrderDelivery } from "@/lib/models";

export type CheckoutErrors = Partial<
  Record<keyof OrderCustomer | keyof OrderDelivery | "shippingMethodId" | "paymentMethod", string>
>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+\d][\d\s()-]{6,}$/;

export function validateCheckout(input: {
  customer: OrderCustomer;
  delivery: OrderDelivery;
  shippingMethodId: string;
  paymentMethod: string;
}): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (!input.customer.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!input.customer.email.trim()) errors.email = "Enter your email.";
  else if (!emailPattern.test(input.customer.email.trim())) errors.email = "Enter a valid email address.";
  if (!input.customer.phone.trim()) errors.phone = "Enter your phone number.";
  else if (!phonePattern.test(input.customer.phone.trim())) errors.phone = "Enter a valid phone number.";
  if (!input.delivery.city.trim()) errors.city = "Enter your city.";
  if (!input.delivery.area.trim()) errors.area = "Enter your area.";
  if (!input.delivery.street.trim()) errors.street = "Enter your street address.";
  if (!input.shippingMethodId) errors.shippingMethodId = "Select a shipping method.";
  if (!input.paymentMethod) errors.paymentMethod = "Select a payment method.";
  return errors;
}

export function createDemoOrder(input: {
  customer: OrderCustomer;
  delivery: OrderDelivery;
  items: CartItem[];
  shippingMethodId: string;
  paymentMethod: string;
}): Order {
  const store = getStore();
  const shipping = store.shippingMethods.find((method) => method.id === input.shippingMethodId);
  const subtotal = money(input.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
  const shippingFee = money(shipping?.fee ?? 0);
  const stamp = Date.now().toString(36).toUpperCase();

  return {
    reference: `GOZ-DEMO-${stamp}`,
    createdAt: new Date().toISOString(),
    customer: input.customer,
    delivery: input.delivery,
    items: input.items,
    subtotal,
    shippingMethodId: input.shippingMethodId,
    shippingMethodName: shipping?.name ?? "Shipping",
    shippingFee,
    total: money(subtotal + shippingFee),
    paymentMethod: input.paymentMethod,
    paymentStatus: "pending",
    orderStatus: "awaiting_payment",
    notes: [
      "This reference was generated in the browser for demonstration only.",
      store.payment.note,
      store.email.note,
    ],
  };
}
