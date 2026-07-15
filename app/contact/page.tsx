import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import ContactForm from "./ContactForm";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialName = "";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile?.full_name) {
      initialName = profile.full_name;
    }
  }

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 pt-20">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact Us</h1>
        <p className="text-muted mt-2 text-lg">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>

      {!user ? (
        <div className="bg-surface border border-border rounded-lg p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Log In Required
          </h2>
          <p className="text-muted mb-6">
            You must be logged in to send us a message. This helps us ensure we can get back to you reliably.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-medium text-background hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Log in to contact us
          </Link>
        </div>
      ) : (
        <ContactForm initialName={initialName} />
      )}
    </div>
  );
}
