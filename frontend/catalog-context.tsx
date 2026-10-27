"use client";

import { createContext, useContext, useMemo } from "react";
import type { Database } from "@/lib/types";
import { setCatalogSnapshot } from "@/lib/catalog-cache";

const CatalogContext = createContext<Database | null>(null);

export function CatalogProvider({ catalog, children }: { catalog: Database; children: React.ReactNode }) {
  setCatalogSnapshot(catalog);
  const value = useMemo(() => catalog, [catalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const catalog = useContext(CatalogContext);
  if (!catalog) throw new Error("useCatalog must be used inside CatalogProvider");
  return catalog;
}
