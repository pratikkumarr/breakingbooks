import Link from "next/link";
import { updatePassword } from "@/app/auth/actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";

export default async function UpdatePassword(props: {
  searchParams: Promise<{ error?: string }>;
}) {
  const searchParams = await props.searchParams;

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto pt-20">
      <Link href="/" className="flex items-center justify-center gap-3 mb-6 hover:opacity-90 transition-opacity">
        <div className="flex items-center justify-center bg-surface border border-border p-1 rounded-full shadow-sm w-12 h-12 shrink-0">
          <img src="/Logo.png" alt="Breaking Books Logo" className="h-full w-full object-contain rounded-full" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-foreground">Breaking Books</span>
      </Link>

      <div className="flex flex-col gap-2 mb-8 items-center text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Update Password</h1>
        <p className="text-sm text-muted">Enter your new password below</p>
      </div>

      <div className="flex-1 flex flex-col w-full justify-center gap-6 text-foreground bg-surface p-8 rounded-xl border border-border shadow-md">
        <form className="flex flex-col gap-6" action={updatePassword}>
          <div className="flex flex-col gap-4">
            <PasswordInput
              id="password"
              name="password"
              label="New Password"
              placeholder="••••••••"
              required
              minLength={6}
            />
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <SubmitButton pendingText="Updating password...">
            Update Password
          </SubmitButton>

          {searchParams?.error && (
            <p className="mt-4 p-4 text-center text-sm rounded-md border bg-red-500/10 border-red-500/20 text-red-500">
              {searchParams.error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
