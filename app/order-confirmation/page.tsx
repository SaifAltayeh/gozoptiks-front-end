import { Suspense } from "react";
import { OrderConfirmationView } from "@/frontend/order-confirmation";

export const metadata = {
  title: "Order confirmation",
};

export default function OrderConfirmationPage() {
  return (
    <div className="page">
      <Suspense>
        <OrderConfirmationView />
      </Suspense>
    </div>
  );
}
