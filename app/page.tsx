import { BrandShowcase } from "@/frontend/brand-showcase";
import { CategoryShowcase } from "@/frontend/category-showcase";
import { EditorialBanner } from "@/frontend/editorial-banner";
import { HeroSlider } from "@/frontend/hero-slider";
import { ProductSection } from "@/frontend/product-section";
import { getHeroSlides, getHomepageSections, loadCatalog } from "@/frontend/catalog";

export default async function HomePage() {
  await loadCatalog();
  const slides = getHeroSlides();
  const sections = getHomepageSections();

  return (
    <>
      <HeroSlider slides={slides} />
      {sections.map((section) => {
        if (section.type === "categories") return <CategoryShowcase key={section.id} section={section} />;
        if (section.type === "brands") return <BrandShowcase key={section.id} section={section} />;
        if (section.type === "editorial") {
          return (
            <EditorialBanner
              key={section.id}
              title={section.title}
              text={section.description ?? ""}
              image={section.image ?? "/images/editorial/indie-01.jpg"}
              href={section.ctaHref ?? "/shop"}
              cta={section.ctaLabel ?? "Shop"}
              variant="panel"
            />
          );
        }
        if (section.type === "products") return <ProductSection key={section.id} section={section} />;
        return null;
      })}
    </>
  );
}
