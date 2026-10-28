import { MediaImage as Image } from "@/frontend/media-image";
import Link from "next/link";
import { getBrands } from "@/frontend/catalog";

export function BrandGrid({ brandIds }: { brandIds?: string[] }) {
  const all = getBrands();
  const brands = brandIds?.length
    ? brandIds.map((id) => all.find((brand) => brand.id === id)).filter((brand): brand is NonNullable<typeof brand> => Boolean(brand))
    : all;

  return (
    <div className="brand-row" data-reveal data-reveal-stagger>
      {brands.map((brand) => (
        <Link key={brand.id} href={`/brands/${brand.slug}`} className="brand-tile">
          {brand.logo ? (
            <span className="brand-logo">
              <Image src={brand.logo} alt={brand.name} fill sizes="180px" />
            </span>
          ) : (
            brand.name
          )}
        </Link>
      ))}
    </div>
  );
}
