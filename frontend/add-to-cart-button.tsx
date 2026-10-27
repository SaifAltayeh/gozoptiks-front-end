"use client";

export function AddToCartButton({
  disabled,
  label,
  onClick,
}: {
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className="btn btn-full" type="button" disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
