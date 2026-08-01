import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Breaking Books",
  description: "Terms of Use for Breaking Books educational platform.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 pt-20">
      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">Terms of Use</h1>
        
        <div className="space-y-6 text-muted">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Platform Usage</h2>
            <p>
              Breaking Books is a free educational platform for CBSE students. Course content (videos, notes) is provided for personal educational use only and may not be redistributed or resold.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Accounts</h2>
            <p>
              Accounts are for individual use. Breaking Books reserves the right to remove content or suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Disclaimer</h2>
            <p>
              The platform is provided as-is without warranty.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p>
              For questions, contact us via the <Link href="/contact" className="text-accent hover:underline">Contact page</Link>.
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
