import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch the user's profile from the profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, class_level")
    .eq("id", user.id)
    .single();

  // Fetch enrollments joined with courses
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      courses:course_id (
        id,
        slug,
        title,
        description
      )
    `)
    .eq("user_id", user.id);

  // Calculate course progress
  const courseIds = enrollments?.map(e => {
    // Supabase returns joined data as object or array depending on the relationship, here it's typically an object if 1:1 or N:1
    const course: any = Array.isArray(e.courses) ? e.courses[0] : e.courses;
    return course?.id;
  }).filter(Boolean) || [];
  
  let courseProgressMap: Record<string, { total: number; completed: number }> = {};
  
  if (courseIds.length > 0) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id, course_id")
      .in("course_id", courseIds);
      
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id)
      .eq("completed", true);
      
    const completedLessonIds = new Set(progress?.map(p => p.lesson_id));
    
    courseIds.forEach(id => {
      courseProgressMap[id] = { total: 0, completed: 0 };
    });
    
    lessons?.forEach(lesson => {
      if (courseProgressMap[lesson.course_id]) {
        courseProgressMap[lesson.course_id].total += 1;
        if (completedLessonIds.has(lesson.id)) {
          courseProgressMap[lesson.course_id].completed += 1;
        }
      }
    });
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-5xl mx-auto p-4 md:p-8 pt-20">
      <div className="flex justify-between items-center bg-surface p-6 rounded-lg border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Welcome, {profile?.full_name || user.email}
          </h1>
          <p className="text-muted mt-1">
            Class Level: {profile?.class_level || "Not specified"}
          </p>
        </div>
        <form action={logout}>
          <SubmitButton className="bg-transparent border border-border text-foreground hover:bg-border focus-visible:ring-offset-surface">
            Log out
          </SubmitButton>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">Your Courses</h2>
        
        {(!enrollments || enrollments.length === 0) ? (
          <div className="bg-surface p-8 rounded-lg border border-border text-center text-muted border-dashed">
            You haven't enrolled in any courses yet. <br />
            <Link href="/courses" className="text-accent hover:underline mt-2 inline-block font-medium">Browse available courses</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrollments.map((enrollment) => {
              const course: any = Array.isArray(enrollment.courses) ? enrollment.courses[0] : enrollment.courses;
              if (!course) return null;
              
              const progressStats = courseProgressMap[course.id];
              let progressPercent = 0;
              if (progressStats && progressStats.total > 0) {
                progressPercent = Math.round((progressStats.completed / progressStats.total) * 100);
              }

              return (
                <div key={enrollment.id} className="bg-surface flex flex-col rounded-lg border border-border p-6 hover:border-accent transition-colors duration-150">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{course.title}</h3>
                  <p className="text-sm text-muted line-clamp-2 mb-6 flex-1">{course.description}</p>
                  
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-muted mb-2 font-medium">
                      <span>Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-border">
                      <div 
                        className="h-full bg-accent transition-all duration-500 ease-in-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    
                    <Link 
                      href={`/courses/${course.slug}`}
                      className="mt-6 w-full inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors duration-150"
                    >
                      {progressPercent > 0 ? "Continue Course" : "Start Course"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
