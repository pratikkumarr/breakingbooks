"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Toast } from "@/components/ui/toast";

export function LoginToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get("login") === "success") {
      setShowToast(true);
      
      // Clean up the URL to prevent the toast from reappearing on refresh
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("login");
      
      const newQueryString = newSearchParams.toString();
      const newUrl = newQueryString ? `${pathname}?${newQueryString}` : pathname;
        
      // Use replace to not add an extra entry to history
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  if (!showToast) return null;

  return <Toast message="You are successfully logged in!" />;
}
