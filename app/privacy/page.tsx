import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Breaking Books",
  description: "Privacy Policy for Breaking Books educational platform.",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 pt-20">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-muted">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Collection</h2>
            <p>
              Breaking Books collects email, full name, and class level at signup; enrollment and lesson-completion progress when logged in; and name/email/message when the contact form is submitted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Usage & Sharing</h2>
            <p>
              This data is used only to operate the platform (authentication, tracking course progress, responding to messages) and is never sold or shared with third parties. Data is stored securely via Supabase (hosted on AWS infrastructure).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
            <p>
              Users can request account/data deletion by contacting us via the <Link href="/contact" className="text-accent hover:underline">Contact page</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cookies & Tracking</h2>
            <p>
              This site currently does not use third-party advertising or tracking cookies. If this changes in the future (for example, if advertising is introduced), this policy will be updated in advance, and continued use of the site after such an update constitutes acceptance of the revised policy.
            </p>
          </section>

          <p className="pt-8 text-sm">
            Last updated: August 1, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
