"use client";

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  labelledBy?: string;
};

export function QuantitySelector({ value, min = 1, max = 99, onChange, labelledBy }: Props) {
  return (
    <div className="qty" role="group" aria-labelledby={labelledBy}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        +
      </button>
    </div>
  );
}
