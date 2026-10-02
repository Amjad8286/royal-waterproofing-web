"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Reads and writes filter values in the URL query string, so filtered views
 * can be shared and the back button works. Must be used inside <Suspense>.
 */
export function useQueryFilters<K extends string>(keys: readonly K[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const values = Object.fromEntries(keys.map((key) => [key, searchParams.get(key) ?? ""])) as Record<K, string>;

  const set = (key: K, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const clear = () => router.replace(pathname, { scroll: false });

  return { values, set, clear };
}
