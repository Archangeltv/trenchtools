import type { Metadata } from "next";

import { BentoGrid } from "@/components/landing/bento-grid";
import { BottomCta } from "@/components/landing/bottom-cta";
import { BrutalistFaq } from "@/components/landing/brutalist-faq";
import { Hero } from "@/components/landing/hero";
import { SlantedMarquee } from "@/components/landing/slanted-marquee";
import { ToolShowcase } from "@/components/landing/tool-showcase";
import {
  SITE_DESCRIPTION,
  SITE_TITLE_DEFAULT,
  landingJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: SITE_TITLE_DEFAULT,
  absoluteTitle: true,
  ogTitle: SITE_TITLE_DEFAULT,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: landingJsonLd() }}
      />
      <Hero />
      <SlantedMarquee />
      <BentoGrid />
      <ToolShowcase />
      <BrutalistFaq />
      <BottomCta />
    </>
  );
}
