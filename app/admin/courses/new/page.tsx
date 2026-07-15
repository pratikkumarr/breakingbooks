import { CourseForm } from "@/components/admin/course-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCoursePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="p-2 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">New Course</h1>
      </div>

      <CourseForm />
    </div>
  );
}
