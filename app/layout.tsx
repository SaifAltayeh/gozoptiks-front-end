import type { Metadata, Viewport } from "next";
import { AppChrome } from "@/frontend/app-chrome";
import { Providers } from "@/frontend/providers";
import { loadCatalog } from "@/frontend/catalog";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const catalog = await loadCatalog();
  return {
    title: {
      default: catalog.store.wordmark,
      template: `%s — ${catalog.store.wordmark}`,
    },
    description: "gözoptik. Eyewear, considered. A customer-facing storefront for frames across brands and categories.",
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await loadCatalog();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem("goz-intro")==="1"){document.documentElement.classList.add("intro-done");}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <noscript>
          <style>{`.intro-splash{display:none}html{overflow:auto}`}</style>
        </noscript>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Providers catalog={data}>
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
