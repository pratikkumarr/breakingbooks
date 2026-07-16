import { CourseForm } from "@/components/admin/course-form";
import { LessonsManager } from "@/components/admin/lessons-manager";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !course) {
    notFound();
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="p-2 rounded-md hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Edit Course: {course.title}</h1>
      </div>

      <CourseForm initialData={course} />
      
      <div className="pt-8 border-t border-[var(--border)]">
        <LessonsManager courseId={course.id} />
      </div>
    </div>
  );
}
