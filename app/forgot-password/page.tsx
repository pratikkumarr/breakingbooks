import Link from "next/link";
import { resetPassword } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";

export default async function ForgotPassword(props: {
  searchParams: Promise<{ message: string }>;
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
          <p className="mt-4 p-4 bg-background text-foreground text-center text-sm border border-border rounded-md">
            {searchParams.message}
          </p>
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
