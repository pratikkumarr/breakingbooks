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

      <ContactForm initialName={initialName} isLoggedIn={!!user} />
    </div>
  );
}
