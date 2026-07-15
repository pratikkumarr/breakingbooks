"use client";

import { useActionState } from "react";
import { submitContactForm } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";

export default function ContactForm({
  initialName,
}: {
  initialName: string;
}) {
  const [state, formAction] = useActionState(submitContactForm, { success: false, error: null });

  if (state.success) {
    return (
      <div className="bg-surface border border-accent/20 rounded-lg p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-accent mb-2">Message Sent!</h2>
        <p className="text-muted">
          Thank you for reaching out. We have received your message and will get back to you shortly.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 text-sm text-foreground font-medium hover:text-accent transition-colors duration-150"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-surface border border-border rounded-lg p-8 shadow-sm flex flex-col gap-6">
      {state.error && (
        <div className="bg-background text-red-500 text-sm border border-red-500/20 p-4 rounded-md">
          {state.error}
        </div>
      )}

      <Input
        id="name"
        name="name"
        label="Name"
        type="text"
        defaultValue={initialName}
        placeholder="Your name"
        required
      />

      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="How can we help you?"
          required
          className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 resize-y"
        />
      </div>

      <SubmitButton pendingText="Sending...">
        Send Message
      </SubmitButton>
    </form>
  );
}
