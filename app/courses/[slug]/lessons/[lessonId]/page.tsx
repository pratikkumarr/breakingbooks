import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { toggleLessonProgress } from "@/app/courses/actions";
import { FileText, ArrowLeft, CheckCircle2, Circle, Play } from "lucide-react";

function extractYouTubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
}

export default async function LessonViewer(props: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const params = await props.params;
  const { slug, lessonId } = params;

  const supabase = await createClient();

  // Fetch course to ensure it's published and to allow returning to it
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, title")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Fetch lesson
  const { data: lesson, error: lessonError } = await supabase
    .from("lessons")
    .select("id, title, youtube_url, pdf_url")
    .eq("id", lessonId)
    .eq("course_id", course.id)
    .single();

  if (lessonError || !lesson) {
    notFound();
  }

  // Check auth and progress
  const { data: { user } } = await supabase.auth.getUser();
  let isCompleted = false;

  if (user) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId)
      .single();
    
    if (progress?.completed) {
      isCompleted = true;
    }
  }

  const handleToggleComplete = async (formData: FormData) => {
    "use server";
    const currentCompleted = formData.get("completed") === "true";
    await toggleLessonProgress(lessonId, !currentCompleted, `/courses/${slug}/lessons/${lessonId}`);
  };

  const youtubeId = lesson.youtube_url ? extractYouTubeId(lesson.youtube_url) : null;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 pt-8">
      <div className="mb-6">
        <Link 
          href={`/courses/${slug}`}
          className="inline-flex items-center text-sm font-medium text-muted hover:text-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Course
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-background border border-border shadow-md relative group">
            {youtubeId ? (
              <a 
                href={lesson.youtube_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full h-full relative"
              >
                <img 
                  src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} 
                  alt={lesson.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-200">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-background shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-8 h-8 ml-1" fill="currentColor" />
                  </div>
                </div>
              </a>
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted bg-surface">
                No video available for this lesson.
              </div>
            )}
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{lesson.title}</h1>
            
            {user && (
              <form action={handleToggleComplete} className="flex items-center">
                <input type="hidden" name="completed" value={String(isCompleted)} />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-background hover:bg-surface text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-150 cursor-pointer"
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      <span className="text-foreground">Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-5 h-5 text-muted" />
                      <span className="text-foreground">Mark Complete</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {lesson.pdf_url && (
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-surface border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">Resources</h2>
              <a
                href={lesson.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-md border border-border bg-background hover:border-accent group transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded bg-surface border border-border group-hover:border-accent group-hover:text-accent text-muted transition-colors duration-150">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors duration-150">Lesson PDF</span>
                  <span className="text-xs text-muted">Download Resource</span>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
