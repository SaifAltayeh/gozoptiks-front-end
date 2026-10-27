import Link from "next/link";
import { getBrands, getCategories, getStore } from "@/frontend/catalog";

export function SiteFooter() {
  const store = getStore();
  const footer = store.footer ?? {
    blurb: "",
    shopTitle: "Shop",
    brandsTitle: "Brands",
    storeTitle: "Store",
    note: "",
    categoryIds: [],
    brandIds: [],
  };
  const allBrands = getBrands();
  const allCategories = getCategories();
  const categories = footer.categoryIds.length
    ? footer.categoryIds
        .map((id) => allCategories.find((category) => category.id === id))
        .filter((category): category is NonNullable<typeof category> => Boolean(category))
    : allCategories;
  const brands = footer.brandIds.length
    ? footer.brandIds
        .map((id) => allBrands.find((brand) => brand.id === id))
        .filter((brand): brand is NonNullable<typeof brand> => Boolean(brand))
    : allBrands;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid" data-reveal>
        <div>
          <Link href="/" className="wordmark">
            {store.wordmark}
          </Link>
          <p style={{ marginTop: "1rem", maxWidth: "22rem" }}>{footer.blurb}</p>
        </div>
        <div>
          <h2>{footer.shopTitle}</h2>
          <ul>
            <li>
              <Link href="/shop">All frames</Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/categories/${category.slug}`}>{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{footer.brandsTitle}</h2>
          <ul>
            {brands.map((brand) => (
              <li key={brand.id}>
                <Link href={`/brands/${brand.slug}`}>{brand.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{footer.storeTitle}</h2>
          <ul>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
            {store.contact.phone ? (
              <li>
                <a href={`tel:${store.contact.phone.replace(/\s/g, "")}`}>{store.contact.phone}</a>
              </li>
            ) : null}
            {store.contact.email ? (
              <li>
                <a href={`mailto:${store.contact.email}`}>{store.contact.email}</a>
              </li>
            ) : null}
            {store.contact.instagram ? (
              <li>
                <a href={store.contact.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
            ) : null}
            {store.contact.social.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <small>
          © {year} {store.wordmark}
        </small>
        {footer.note ? <small>{footer.note}</small> : null}
      </div>
    </footer>
  );
}
