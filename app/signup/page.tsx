import Link from "next/link";
import { signup, signInWithGoogle } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Signup(props: {
  searchParams: Promise<{ message?: string, error?: string, success?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-12 pb-12">
      <div className="flex flex-col gap-2 mb-8 items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create an Account</h1>
        <p className="text-sm text-muted">Join Breaking Books today</p>
      </div>

      <div className="flex-1 flex flex-col w-full justify-center gap-6 text-foreground bg-surface p-8 rounded-xl border border-border shadow-md">
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 w-full h-10 rounded-md border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-border/30 focus-visible:outline-none focus-visible:border-accent transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="flex items-center gap-4 w-full">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-xs text-muted uppercase font-medium">Or</span>
          <div className="h-px bg-border flex-1"></div>
        </div>

        <form className="flex flex-col gap-6" action={signup}>
          <div className="flex flex-col gap-4">
            <Input
              id="fullName"
              name="fullName"
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              required
            />
            
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="classLevel" className="text-sm font-medium text-foreground">
                Class Level
              </label>
              <select
                id="classLevel"
                name="classLevel"
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-accent"
                required
                defaultValue=""
              >
                <option value="" disabled className="text-muted">Select your class</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <SubmitButton pendingText="Signing up...">
            Sign up
          </SubmitButton>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-background text-foreground text-center text-sm border border-border rounded-md">
              {searchParams.message}
            </p>
          )}
          {searchParams?.error === "already_registered" && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-center text-sm rounded-md">
              This email is already registered. <Link href="/login" className="underline font-medium hover:text-red-400">Please log in instead.</Link>
            </div>
          )}
          {searchParams?.success === "verification_sent" && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-center text-sm rounded-md">
              Verification link sent! Please check your email (including spam folder) to confirm your account before logging in.
            </div>
          )}
        </form>
      </div>

      <div className="text-center mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm">
          Log in
        </Link>
      </div>
    </div>
  );
}
