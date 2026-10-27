import Link from "next/link";

export function EmptyState({
  title,
  text,
  href,
  cta,
}: {
  title: string;
  text: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="empty" data-reveal>
      <h1 className="shop-title">{title}</h1>
      <p className="muted">{text}</p>
      {href && cta ? (
        <Link href={href} className="btn">
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
