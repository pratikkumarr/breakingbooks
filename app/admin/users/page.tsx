import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Search } from "lucide-react";
import { RoleSelect } from "./role-select";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const adminClient = await createAdminClient();

  let query = adminClient
    .from("profiles")
    .select("id, full_name, class_level, role, created_at")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("full_name", `%${q}%`);
  }

  const { data: users, error } = await query;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Users</h1>
        
        {/* Search form */}
        <form className="relative w-full sm:w-64">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-md text-sm focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
          />
          <Search className="absolute left-3 top-2.5 text-[var(--muted)]" size={16} />
        </form>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                <th className="p-4 font-medium text-[var(--muted)] whitespace-nowrap">Full Name</th>
                <th className="p-4 font-medium text-[var(--muted)] whitespace-nowrap">Class Level</th>
                <th className="p-4 font-medium text-[var(--muted)] whitespace-nowrap">Role</th>
                <th className="p-4 font-medium text-[var(--muted)] text-right whitespace-nowrap">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[var(--muted)]">
                    {q ? "No users found matching your search." : "No registered users found."}
                  </td>
                </tr>
              )}
              {users?.map((profile) => (
                <tr key={profile.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)] transition-colors duration-200">
                  <td className="p-4">
                    <div className="font-medium text-[var(--foreground)]">{profile.full_name || "Unknown"}</div>
                  </td>
                  <td className="p-4 text-[var(--muted)]">
                    {profile.class_level ? `Class ${profile.class_level}` : "-"}
                  </td>
                  <td className="p-4">
                    <RoleSelect 
                      userId={profile.id} 
                      currentRole={profile.role || "student"} 
                      disabled={profile.id === user.id} 
                    />
                    {profile.id === user.id && (
                      <span className="text-xs text-[var(--muted)] ml-2">(You)</span>
                    )}
                  </td>
                  <td className="p-4 text-right text-[var(--muted)] whitespace-nowrap">
                    {new Date(profile.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
