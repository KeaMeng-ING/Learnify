"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Parse the href to extract pathname and query params
  const [hrefPath, hrefQuery] = href.split("?");
  const pathMatches = pathname === hrefPath;

  // Check if query params match (if they exist in href)
  let queryMatches = true;
  if (hrefQuery) {
    const hrefParams = new URLSearchParams(hrefQuery);
    queryMatches = Array.from(hrefParams.entries()).every(
      ([key, value]) => searchParams.get(key) === value
    );
  }

  const isActive = pathMatches && queryMatches;

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors text-sm duration-200 text-gray-600 hover:text-purple-600",
        className,
        isActive && "text-purple-600"
      )}
    >
      {children}
    </Link>
  );
}
