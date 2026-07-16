import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { DeleteCourseButton } from "./delete-course-button";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Courses</h1>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 bg-accent text-background px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors duration-200 font-medium"
        >
          <Plus size={18} />
          New Course
        </Link>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background)]">
              <th className="p-4 font-medium text-[var(--muted)]">Title</th>
              <th className="p-4 font-medium text-[var(--muted)]">Status</th>
              <th className="p-4 font-medium text-[var(--muted)]">Level</th>
              <th className="p-4 font-medium text-[var(--muted)] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!courses || courses.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--muted)]">
                  No courses found. Create one to get started.
                </td>
              </tr>
            )}
            {courses?.map((course) => (
              <tr key={course.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--background)] transition-colors duration-200">
                <td className="p-4">
                  <div className="font-medium text-[var(--foreground)]">{course.title}</div>
                  <div className="text-sm text-[var(--muted)]">{course.slug}</div>
                </td>
                <td className="p-4">
                  {course.published ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-900/50">
                      Draft
                    </span>
                  )}
                </td>
                <td className="p-4 text-[var(--muted)]">{course.class_level || "-"}</td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="inline-flex items-center justify-center p-2 rounded-md text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--background)] transition-colors duration-200"
                  >
                    <Edit size={18} />
                  </Link>
                  <DeleteCourseButton id={course.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
