import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { TypewriterText } from "@/components/TypewriterText";

export const metadata: Metadata = {
  title: "Home",
  description: "Master CBSE IT (Code 402) and Computer Science for Classes 9-12 with our free, high-quality lessons.",
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, slug, title, description, thumbnail_url, subject, class_level")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <div className="flex-1 w-full flex flex-col items-center relative">
      {/* Absolute Ambient Background Texture starting from the top */}
      <div className="absolute top-0 inset-x-0 h-[700px] md:h-[800px] z-[-1] overflow-hidden pointer-events-none select-none">
        <Image 
          src="/homepage-banner.png" 
          alt="Breaking Books Ambient Texture" 
          fill
          priority
          className="object-cover object-top opacity-15"
        />
        {/* Gradient overlay to smoothly taper the image into the background color */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-6xl px-6 py-24 md:py-32 flex flex-col items-center text-center gap-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight z-10 relative">
          <span className="text-foreground">Welcome to </span>
          <TypewriterText text="Breaking Books!" className="text-accent" />
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto px-4 sm:px-0 z-10 relative">
          <Link 
            href="/courses" 
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-medium text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 min-h-[44px]"
          >
            Browse Courses
          </Link>
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-border bg-transparent px-8 py-3 text-base font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 min-h-[44px]"
          >
            Dashboard
          </Link>
        </div>
      </section>

          {/* Recent Courses Section */}
          <section className="w-full max-w-6xl px-6 pb-12 md:pb-24 flex flex-col items-center">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">Recently Published</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">Check out the latest additions to our curriculum and start learning today.</p>
            </div>
        
        <div className="flex md:grid overflow-x-auto snap-x snap-mandatory md:grid-cols-2 lg:grid-cols-4 gap-6 w-full pb-6 md:pb-0">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="flex flex-col bg-surface border border-border rounded-xl p-5 hover:border-accent hover:-translate-y-1 hover:shadow-md transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent group min-w-[280px] sm:min-w-[320px] md:min-w-0 shrink-0 snap-start"
            >
              {course.thumbnail_url ? (
                <div className="w-full aspect-video mb-5 rounded-lg overflow-hidden shrink-0 border border-border relative">
                  <Image 
                    src={course.thumbnail_url} 
                    alt={course.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out" 
                  />
                </div>
              ) : (
                <div className="w-full aspect-video mb-5 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">
                  <span className="text-muted text-sm font-medium">No Thumbnail</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">{course.title}</h3>
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
              <div className="mt-6 text-sm font-medium text-accent flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                View Course <span>&rarr;</span>
              </div>
            </Link>
          ))}
          {(!courses || courses.length === 0) && (
            <div className="col-span-full py-16 text-center text-muted bg-surface rounded-xl border border-border border-dashed min-w-full">
              No courses are currently available. Check back later!
            </div>
          )}
        </div>
        
        {courses && courses.length > 0 && (
          <div className="mt-8 md:mt-12">
            <Link 
              href="/courses" 
              className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-8 py-3 text-base font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 min-h-[44px]"
            >
              View All Courses
            </Link>
          </div>
        )}
      </section>


      {/* About Section */}
      <section className="w-full bg-surface border-y border-border py-24 px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">About Breaking Books</h2>
          <p className="text-lg md:text-xl text-muted leading-relaxed">
            Breaking Books is a completely free learning platform dedicated to helping you master CBSE Information Technology (Code 402) and Computer Science for Classes 9-12. We believe high-quality education should be accessible to everyone without paywalls or barriers.
            <span className="block mt-4">
              <a href="https://www.youtube.com/@breakinngbooks" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">Subscribe to our YouTube channel</a> for video lessons and updates.
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
