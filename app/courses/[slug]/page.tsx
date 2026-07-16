import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { enrollInCourse } from "@/app/courses/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!course) {
    return {
      title: "Course Not Found",
    };
  }

  return {
    title: course.title,
    description: course.description?.slice(0, 160) || "Course details",
  };
}

export default async function CourseDetails(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const slug = params.slug;

  const supabase = await createClient();

  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title, description, thumbnail_url")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (courseError || !course) {
    notFound();
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, order_index")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  const { data: { user } } = await supabase.auth.getUser();
  let isEnrolled = false;

  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .single();
    
    if (enrollment) {
      isEnrolled = true;
    }
  }

  const handleEnroll = async () => {
    "use server";
    const supabaseClient = await createClient();
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      redirect("/login");
    }

    await enrollInCourse(course.id, `/courses/${slug}`);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-8 pt-20">
      <div className="bg-surface border border-border rounded-lg p-8 mb-8 shadow-sm">
        {course.thumbnail_url && (
          <div className="w-full aspect-video mb-6 rounded-md overflow-hidden border border-border relative">
            <Image 
              src={course.thumbnail_url} 
              alt={course.title} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover" 
            />
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{course.title}</h1>
        <p className="text-muted mt-4 text-lg whitespace-pre-wrap">{course.description}</p>
        
        <div className="mt-8">
          {isEnrolled ? (
            <div className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-muted cursor-default">
              You are enrolled
            </div>
          ) : (
            <form action={handleEnroll}>
              <SubmitButton pendingText="Enrolling...">
                Enroll in Course
              </SubmitButton>
            </form>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Course Lessons</h2>
        <div className="flex flex-col gap-3">
          {lessons?.map((lesson, index) => (
            <Link
              key={lesson.id}
              href={`/courses/${slug}/lessons/${lesson.id}`}
              className="flex items-center gap-4 bg-surface border border-border rounded-lg p-4 hover:border-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background border border-border text-sm font-medium text-muted group-hover:border-accent group-hover:text-accent transition-colors duration-150">
                {index + 1}
              </div>
              <span className="font-medium text-foreground text-lg group-hover:text-accent transition-colors duration-150">{lesson.title}</span>
            </Link>
          ))}
          {(!lessons || lessons.length === 0) && (
            <div className="py-8 text-center text-muted bg-surface rounded-lg border border-border border-dashed">
              No lessons have been added to this course yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
