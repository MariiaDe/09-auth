"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const PRIVATE_PREFIXES = ["/notes", "/profile"];

function isPrivatePath(pathname: string) {
  return PRIVATE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const setUser = useAuthStore((s) => s.setUser);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);

      try {
        
        const sessionUser = await checkSession();
        if (cancelled) return;

        if (sessionUser) {
          
          const me = await getMe();
          if (cancelled) return;

          setUser(me);
          return;
        }

        
        clearIsAuthenticated();

       
        if (isPrivatePath(pathname)) {
          try {
            await logout();
          } catch {
          
          }
          if (!cancelled) router.replace("/sign-in");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <p style={{ padding: 24 }}>Loading...</p>;
  }

  
  if (isPrivatePath(pathname) && !useAuthStore.getState().isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
