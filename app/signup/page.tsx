import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Signup(props: {
  searchParams: Promise<{ message: string }>;
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
        <p className="text-sm text-muted">Join our edtech platform today</p>
      </div>

      <form className="flex-1 flex flex-col w-full justify-center gap-6 text-foreground bg-surface p-8 rounded-lg border border-border shadow-md">
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

        <SubmitButton formAction={signup} pendingText="Signing up...">
          Sign up
        </SubmitButton>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-background text-foreground text-center text-sm border border-border rounded-md">
            {searchParams.message}
          </p>
        )}
      </form>

      <div className="text-center mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm">
          Log in
        </Link>
      </div>
    </div>
  );
}
