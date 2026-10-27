import { Suspense } from "react";
import { SearchResults } from "@/frontend/search-results";

export const metadata = {
  title: "Search",
};

export default function SearchPage() {
  return (
    <div className="page">
      <Suspense>
        <SearchResults />
      </Suspense>
    </div>
  );
}
