import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CoursesList() {
  const supabase = await createClient();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, thumbnail_url")
    .eq("published", true);

  if (error) {
    console.error("Error fetching courses:", error);
  }

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-8 pt-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">All Courses</h1>
        <p className="text-muted mt-2 text-lg">Browse our catalog of professional edtech courses.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="flex flex-col bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
          >
            {course.thumbnail_url && (
              <div className="w-full aspect-video mb-4 rounded-md overflow-hidden shrink-0 border border-border">
                <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" />
              </div>
            )}
            <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-150">{course.title}</h2>
            <p className="text-sm text-muted flex-1 line-clamp-3">{course.description}</p>
            <div className="mt-6 text-sm font-medium text-accent">View Course &rarr;</div>
          </Link>
        ))}
        {(!courses || courses.length === 0) && (
          <div className="col-span-full py-12 text-center text-muted bg-surface rounded-lg border border-border border-dashed">
            No courses are currently available. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
