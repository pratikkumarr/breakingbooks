import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Master CBSE IT (Code 402) and Computer Science for Classes 9-12 with our free, high-quality lessons.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, thumbnail_url")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-6xl px-6 py-24 md:py-32 flex flex-col items-center text-center gap-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
          Breaking Books
        </h1>
        <p className="text-xl md:text-2xl text-muted max-w-3xl leading-relaxed">
          Master CBSE IT (Code 402) and Computer Science for Classes 9-12 with our free, high-quality lessons.
        </p>
        <div className="flex gap-4 mt-8">
          <Link 
            href="/courses" 
            className="inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-medium text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
          >
            Browse Courses
          </Link>
          <Link 
            href="/signup" 
            className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-8 py-3 text-base font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full bg-surface border-y border-border py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="flex flex-col items-center p-8 bg-background rounded-xl border border-border hover:border-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center mb-6 text-2xl font-bold text-accent">1</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Browse Courses</h3>
              <p className="text-muted leading-relaxed">Find the right subject for your class, whether it's Information Technology (Code 402) or Computer Science.</p>
            </div>
            <div className="flex flex-col items-center p-8 bg-background rounded-xl border border-border hover:border-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center mb-6 text-2xl font-bold text-accent">2</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Watch Lessons</h3>
              <p className="text-muted leading-relaxed">Learn through our detailed, easy-to-understand lesson materials, practical exercises, and videos.</p>
            </div>
            <div className="flex flex-col items-center p-8 bg-background rounded-xl border border-border hover:border-accent/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-surface border border-border flex items-center justify-center mb-6 text-2xl font-bold text-accent">3</div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Track Progress</h3>
              <p className="text-muted leading-relaxed">Sign up for a free account to track your completed lessons, save your progress, and pick up where you left off.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Courses Section */}
      <section className="w-full max-w-6xl px-6 py-24 flex flex-col items-center">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Recently Published</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">Check out the latest additions to our curriculum and start learning today.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="flex flex-col bg-surface border border-border rounded-xl p-5 hover:border-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group"
            >
              {course.thumbnail_url ? (
                <div className="w-full aspect-video mb-5 rounded-lg overflow-hidden shrink-0 border border-border">
                  <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" />
                </div>
              ) : (
                <div className="w-full aspect-video mb-5 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                  <span className="text-muted text-sm font-medium">No Thumbnail</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors duration-150 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-muted flex-1 line-clamp-3 leading-relaxed">{course.description}</p>
              <div className="mt-6 text-sm font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                View Course <span>&rarr;</span>
              </div>
            </Link>
          ))}
          {(!courses || courses.length === 0) && (
            <div className="col-span-full py-16 text-center text-muted bg-surface rounded-xl border border-border border-dashed">
              No courses are currently available. Check back later!
            </div>
          )}
        </div>
        
        {courses && courses.length > 0 && (
          <div className="mt-16">
            <Link 
              href="/courses" 
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-8 py-3 text-base font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
            >
              View All Courses
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
