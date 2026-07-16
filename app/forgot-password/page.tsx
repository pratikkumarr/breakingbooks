import Link from "next/link";
import { resetPassword } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";

export default async function ForgotPassword(props: {
  searchParams: Promise<{ message?: string, error?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <div className="flex flex-col gap-2 mb-8 items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reset Password</h1>
        <p className="text-sm text-muted">Enter your email to receive a reset link</p>
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
        </div>

        <SubmitButton formAction={resetPassword} pendingText="Sending...">
          Send Reset Link
        </SubmitButton>

        {searchParams?.message && (
          <p className="mt-4 p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-center text-sm rounded-md">
            {searchParams.message}
          </p>
        )}
        {searchParams?.error === "user_not_registered" && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-center text-sm rounded-md">
            User not registered. <Link href="/signup" className="underline font-medium hover:text-red-400">Please sign up instead.</Link>
          </div>
        )}
      </form>

      <div className="text-center mt-6 text-sm text-muted">
        Remember your password?{" "}
        <Link href="/login" className="text-accent hover:underline font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded-sm">
          Log in
        </Link>
      </div>
    </div>
  );
}
