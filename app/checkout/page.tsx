import { CheckoutForm } from "@/frontend/checkout-form";

export const metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="page">
      <CheckoutForm />
    </div>
  );
}
