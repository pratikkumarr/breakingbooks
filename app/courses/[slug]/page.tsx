import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { enrollInCourse } from "@/app/courses/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { CheckCircle2 } from "lucide-react";
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
    .select("id, title, order_index, duration_min")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  const totalLessons = lessons?.length || 0;
  const totalDuration = lessons?.reduce((acc, l) => acc + (l.duration_min || 0), 0) || 0;

  const { data: { user } } = await supabase.auth.getUser();
  let isEnrolled = false;
  let completedLessonIds = new Set<string>();

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

    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .eq("completed", true);
      
    if (progress) {
      progress.forEach(p => completedLessonIds.add(p.lesson_id));
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
      <div className="bg-surface border border-border rounded-xl p-8 mb-8 shadow-sm">
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
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-muted">
          <div className="bg-background border border-border px-3 py-1 rounded-full">
            {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
          </div>
          {totalDuration > 0 && (
            <div className="bg-background border border-border px-3 py-1 rounded-full">
              ~{Math.round(totalDuration / 60)} hrs {totalDuration % 60} mins
            </div>
          )}
        </div>

        <p className="text-muted mt-6 text-lg whitespace-pre-wrap leading-relaxed">{course.description}</p>
        
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
          {lessons?.map((lesson, index) => {
            const isCompleted = completedLessonIds.has(lesson.id);
            return (
              <Link
                key={lesson.id}
                href={`/courses/${slug}/lessons/${lesson.id}`}
                className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4 hover:border-accent hover:-translate-y-1 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border text-sm font-medium transition-colors duration-200 ${isCompleted ? 'bg-accent border-accent text-background' : 'bg-background border-border text-muted group-hover:border-accent group-hover:text-accent'}`}>
                  {isCompleted ? <CheckCircle2 size={16} className="text-background" /> : index + 1}
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className={`font-medium text-lg transition-colors duration-200 ${isCompleted ? 'text-muted' : 'text-foreground group-hover:text-accent'}`}>{lesson.title}</span>
                  {lesson.duration_min > 0 && (
                    <span className="text-sm text-muted">{lesson.duration_min} min</span>
                  )}
                </div>
              </Link>
            );
          })}
          {(!lessons || lessons.length === 0) && (
            <div className="py-12 text-center text-muted bg-surface rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
              <p>Lessons for this course will be added soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
