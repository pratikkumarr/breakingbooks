import Link from "next/link";
import { login } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Login(props: {
  searchParams: Promise<{ message: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <div className="flex flex-col gap-2 mb-8 items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
        <p className="text-sm text-muted">Log in to your Breaking Books account</p>
      </div>

      <form className="flex-1 flex flex-col w-full justify-center gap-6 text-foreground bg-surface p-8 rounded-xl border border-border shadow-md">
        <div className="flex flex-col gap-4">
          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
          />
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-accent hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm">
                Forgot password?
              </Link>
            </div>
            <input
              className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:border-accent"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <SubmitButton formAction={login} pendingText="Logging in...">
          Log in
        </SubmitButton>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-background text-foreground text-center text-sm border border-border rounded-md">
            {searchParams.message}
          </p>
        )}
      </form>

      <div className="text-center mt-6 text-sm text-muted">
        Don't have an account?{" "}
        <Link href="/signup" className="text-accent hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm">
          Sign up
        </Link>
      </div>
    </div>
  );
}
