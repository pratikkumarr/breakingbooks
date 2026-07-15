import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col w-full justify-center items-center gap-6 py-32 px-4 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground max-w-2xl">
        The Future of Professional Education
      </h1>
      <p className="text-muted max-w-xl text-lg">
        Join our platform to access world-class educational resources and connect with peers in a distraction-free environment.
      </p>
      <div className="flex gap-4 mt-6">
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center rounded-md border border-border bg-transparent px-6 py-3 text-sm font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
        >
          Log In
        </Link>
        <Link 
          href="/signup" 
          className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
