"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { Toast } from "./ui/toast";

function VerifyToastContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setShowToast(true);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("verified");
      const newUrl = `${pathname}${newSearchParams.toString() ? `?${newSearchParams.toString()}` : ''}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [pathname, searchParams]);

  if (!showToast) return null;

  return <Toast message="Email verified! You're now logged in." />;
}

export function VerifyToast() {
  return (
    <Suspense fallback={null}>
      <VerifyToastContent />
    </Suspense>
  );
}
