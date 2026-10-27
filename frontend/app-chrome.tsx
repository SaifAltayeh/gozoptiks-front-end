"use client";

import { AnnouncementBar } from "@/frontend/announcement-bar";
import { CartDrawer } from "@/frontend/cart-drawer";
import { IntroSplash } from "@/frontend/intro-splash";
import { MobileNav } from "@/frontend/mobile-nav";
import { MotionRoot } from "@/frontend/motion-root";
import { SearchOverlay } from "@/frontend/search-overlay";
import { SiteFooter } from "@/frontend/site-footer";
import { SiteHeader } from "@/frontend/site-header";

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <IntroSplash />
      <MotionRoot />
      <div className="site">
        <AnnouncementBar />
        <SiteHeader />
        <main id="main" className="site-main">
          {children}
        </main>
        <SiteFooter />
      </div>
      <SearchOverlay />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
