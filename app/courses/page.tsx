import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { CourseFilters } from "@/components/CourseFilters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
  description: "Browse our catalog of professional courses for CBSE IT and Computer Science.",
};

export default async function CoursesList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const supabase = await createClient();
  const params = await searchParams;

  const classLevel = typeof params.class === "string" ? params.class : undefined;
  const subject = typeof params.subject === "string" ? params.subject : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;

  // Fetch unique subjects for the filter dropdown
  const { data: subjectData } = await supabase
    .from("courses")
    .select("subject")
    .eq("published", true);

  const subjects = Array.from(new Set(subjectData?.map(d => d.subject).filter(Boolean) || []));

  let query = supabase
    .from("courses")
    .select("id, slug, title, description, thumbnail_url, subject, class_level")
    .eq("published", true);

  if (classLevel && classLevel !== "all") {
    query = query.eq("class_level", classLevel);
  }
  if (subject && subject !== "all") {
    query = query.eq("subject", subject);
  }
  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data: courses, error } = await query;

  if (error) {
    console.error("Error fetching courses:", error);
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 pt-10 md:pt-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">All Courses</h1>
        <p className="text-muted mt-2 text-lg">Browse our catalog of professional courses.</p>
      </div>

      <CourseFilters subjects={subjects} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="flex flex-col bg-surface border border-border rounded-xl p-5 hover:border-accent hover:-translate-y-1 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
          >
            {course.thumbnail_url && (
              <div className="w-full aspect-video mb-4 rounded-md overflow-hidden shrink-0 border border-border relative">
                <Image 
                  src={course.thumbnail_url} 
                  alt={course.title} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" 
                />
              </div>
            )}
            <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">{course.title}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {course.class_level && (
                <span className="inline-flex items-center rounded-full bg-background border border-border px-2 py-0.5 text-xs font-medium text-muted">
                  Class {course.class_level}
                </span>
              )}
              {course.subject && (
                <span className="inline-flex items-center rounded-full bg-background border border-border px-2 py-0.5 text-xs font-medium text-muted">
                  {course.subject}
                </span>
              )}
            </div>
            <p className="text-sm text-muted flex-1 line-clamp-3 leading-relaxed">{course.description}</p>
            <div className="mt-6 text-sm font-medium text-accent">View Course &rarr;</div>
          </Link>
        ))}
        {(!courses || courses.length === 0) && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-surface rounded-xl border border-border border-dashed">
            <p className="text-muted text-lg mb-4">No courses match these filters.</p>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-200 min-h-[44px]">
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
