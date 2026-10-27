import Image from "next/image";
import Link from "next/link";

type Props = {
  kicker?: string;
  title: string;
  text: string;
  image: string;
  href: string;
  cta: string;
  variant?: "card" | "panel";
};

export function EditorialBanner({ kicker, title, text, image, href, cta, variant = "card" }: Props) {
  const copy = (
    <div className="editorial-copy">
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2 className="editorial-title">{title}</h2>
      <p className="editorial-text">{text}</p>
      <Link href={href} className="text-link">
        {cta}
      </Link>
    </div>
  );

  if (variant === "panel") {
    return (
      <section className="editorial editorial--panel" data-reveal>
        <div className="editorial-media">
          <Image src={image} alt="" fill sizes="(max-width: 860px) 100vw, 65vw" />
        </div>
        {copy}
      </section>
    );
  }

  return (
    <section className="editorial" data-reveal>
      <div className="editorial-media">
        <Image src={image} alt="" fill sizes="100vw" />
        {copy}
      </div>
    </section>
  );
}
