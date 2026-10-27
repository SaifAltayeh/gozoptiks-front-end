import Link from "next/link";
import { getStore } from "@/frontend/catalog";

export function AnnouncementBar() {
  const store = getStore();
  if (!store.announcement.enabled) return null;
  return (
    <div className="announce">
      <Link href={store.announcement.href}>{store.announcement.text}</Link>
    </div>
  );
}
