"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

function NavLinkInner({ href, children, className }: NavLinkProps) {
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

export default function NavLink(props: NavLinkProps) {
  return (
    <Suspense
      fallback={
        <Link
          href={props.href}
          className={cn(
            "transition-colors text-sm duration-200 text-gray-600 hover:text-purple-600",
            props.className
          )}
        >
          {props.children}
        </Link>
      }
    >
      <NavLinkInner {...props} />
    </Suspense>
  );
}
