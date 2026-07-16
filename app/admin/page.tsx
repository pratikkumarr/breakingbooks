import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { Users, BookOpen, CheckCircle, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  const adminClient = await createAdminClient();

  // Fetch counts in parallel
  const [
    { count: totalCourses },
    { count: publishedCourses },
    { count: totalUsers },
    { count: totalEnrollments },
  ] = await Promise.all([
    adminClient.from("courses").select("*", { count: "exact", head: true }),
    adminClient.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
    adminClient.from("profiles").select("*", { count: "exact", head: true }),
    adminClient.from("enrollments").select("*", { count: "exact", head: true }),
  ]);

  // Fetch recent enrollments
  const { data: recentEnrollments } = await adminClient
    .from("enrollments")
    .select("id, created_at, profiles(full_name), courses(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Courses",
      value: totalCourses || 0,
      icon: <BookOpen className="text-blue-500" size={24} />,
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Published Courses",
      value: publishedCourses || 0,
      icon: <CheckCircle className="text-green-500" size={24} />,
      bg: "bg-green-500/10",
      border: "border-green-500/20",
    },
    {
      title: "Total Users",
      value: totalUsers || 0,
      icon: <Users className="text-purple-500" size={24} />,
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Total Enrollments",
      value: totalEnrollments || 0,
      icon: <Activity className="text-[var(--accent)]" size={24} />,
      bg: "bg-[var(--accent)]/10",
      border: "border-[var(--accent)]/20",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-xl border ${stat.border} ${stat.bg} flex items-center justify-between`}>
            <div>
              <p className="text-sm font-medium text-[var(--muted)] mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-[var(--foreground)]">{stat.value}</h3>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden mt-8">
        <div className="p-6 border-b border-[var(--border)]">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Recent Enrollments</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="p-4 font-medium text-[var(--muted)] text-sm">User</th>
              <th className="p-4 font-medium text-[var(--muted)] text-sm">Course</th>
              <th className="p-4 font-medium text-[var(--muted)] text-sm text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            {(!recentEnrollments || recentEnrollments.length === 0) ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-[var(--muted)]">
                  No recent enrollments found.
                </td>
              </tr>
            ) : (
              recentEnrollments.map((enrollment: any) => (
                <tr key={enrollment.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)] transition-colors duration-200">
                  <td className="p-4 font-medium text-[var(--foreground)]">
                    {Array.isArray(enrollment.profiles) ? enrollment.profiles[0]?.full_name : enrollment.profiles?.full_name || "Unknown User"}
                  </td>
                  <td className="p-4 text-[var(--muted)]">
                    {Array.isArray(enrollment.courses) ? enrollment.courses[0]?.title : enrollment.courses?.title || "Unknown Course"}
                  </td>
                  <td className="p-4 text-right text-sm text-[var(--muted)] whitespace-nowrap">
                    {new Date(enrollment.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {recentEnrollments && recentEnrollments.length > 0 && (
          <div className="p-4 border-t border-[var(--border)] bg-[var(--background)] text-center">
            <Link href="/admin/users" className="text-sm text-[var(--accent)] hover:underline font-medium">
              Manage Users &rarr;
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
