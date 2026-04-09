import { PageSection } from "@/core/shared/section-types";
import { HeroSection } from "./renderer/hero-section";
import { TextWithImageSection } from "./renderer/text-with-image-section";
import { ServicesGridSection } from "./renderer/services-grid-section";
import { GallerySection } from "./renderer/gallery-section";
import { MapSection } from "./renderer/map-section";
import { ContactFormSection } from "./renderer/contact-form-section";
import { SocialLinksSection } from "./renderer/social-links-section";
import { ReviewsSection } from "./renderer/reviews-section";
import { PriceListSection } from "./renderer/price-list-section";

interface Props {
  section: PageSection;
}

export function SectionRenderer({ section }: Props) {
  const s = section.settings;

  switch (section.type) {
    case "hero":            return <HeroSection settings={s} />;
    case "text-with-image": return <TextWithImageSection settings={s} />;
    case "services-grid":   return <ServicesGridSection settings={s} />;
    case "gallery":         return <GallerySection settings={s} />;
    case "map":             return <MapSection settings={s} />;
    case "contact-form":    return <ContactFormSection settings={s} />;
    case "social-links":    return <SocialLinksSection settings={s} />;
    case "reviews":         return <ReviewsSection settings={s} />;
    case "price-list":      return <PriceListSection settings={s} />;
    default:                return null;
  }
}
