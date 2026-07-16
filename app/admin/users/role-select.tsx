"use client";

import { useState } from "react";
import { updateUserRole } from "./actions";
import { useRouter } from "next/navigation";

export function RoleSelect({ 
  userId, 
  currentRole, 
  disabled 
}: { 
  userId: string, 
  currentRole: string, 
  disabled: boolean 
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    
    // Safety confirm for promoting to admin
    if (newRole === "admin") {
      const confirmed = window.confirm("Are you sure you want to grant admin privileges to this user?");
      if (!confirmed) {
        // Reset the select back to currentRole if they cancel
        e.target.value = currentRole;
        return;
      }
    }
    
    // Safety confirm for demoting from admin
    if (currentRole === "admin" && newRole !== "admin") {
      const confirmed = window.confirm("Are you sure you want to revoke admin privileges from this user?");
      if (!confirmed) {
        e.target.value = currentRole;
        return;
      }
    }

    setIsPending(true);
    try {
      await updateUserRole(userId, newRole);
      // Optional: show a small toast notification here if you have a toast library configured
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to update role");
      e.target.value = currentRole; // reset on error
    } finally {
      setIsPending(false);
    }
  };

  return (
    <select
      defaultValue={currentRole}
      disabled={disabled || isPending}
      onChange={handleRoleChange}
      className="px-3 py-1.5 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 appearance-none min-w-[100px]"
    >
      <option value="student">Student</option>
      <option value="admin">Admin</option>
    </select>
  );
}
