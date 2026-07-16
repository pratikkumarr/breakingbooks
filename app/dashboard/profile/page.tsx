import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/ui/submit-button";
import { updateProfile } from "./actions";
import Link from "next/link";

export default async function ProfilePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, class_level")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 pt-10 md:pt-20">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Profile</h1>
        <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-foreground transition-colors duration-200">
          &larr; Back to Dashboard
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-sm">
        <form className="flex flex-col gap-6" action={updateProfile}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email || ""}
              disabled
              className="px-4 py-3 bg-background border border-border rounded-md text-muted cursor-not-allowed focus:outline-none min-h-[44px]"
            />
            <p className="text-xs text-muted">Your email address is managed securely and cannot be changed here.</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="full_name" className="text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              defaultValue={profile?.full_name || ""}
              placeholder="e.g. Rahul Kumar"
              className="px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="class_level" className="text-sm font-medium text-foreground">Class Level</label>
            <select
              id="class_level"
              name="class_level"
              defaultValue={profile?.class_level || ""}
              className="px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] appearance-none"
            >
              <option value="">Select Class</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          {searchParams && (searchParams.error || searchParams.message) && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm">
              {searchParams.error || searchParams.message}
            </div>
          )}
          {searchParams && searchParams.success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-md text-sm">
              Profile updated successfully.
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <SubmitButton pendingText="Saving...">
              Save Changes
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
}
