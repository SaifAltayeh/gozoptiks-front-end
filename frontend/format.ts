import { getStore } from "@/frontend/catalog";

export function formatPrice(amount: number, currency = getStore().currency): string {
  const hasFraction = Math.round(amount * 100) % 100 !== 0;
  const value = amount.toLocaleString(currency.locale, {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${value} ${currency.code}`;
}

export function money(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
