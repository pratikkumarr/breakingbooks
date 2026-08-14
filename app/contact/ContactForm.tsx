"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { submitContactForm } from "./actions";
import { Toast } from "@/components/ui/toast";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ContactForm({
  initialName,
  isLoggedIn = true,
}: {
  initialName: string;
  isLoggedIn?: boolean;
}) {
  const [state, formAction] = useActionState(submitContactForm, { success: false, error: null });

  const formRef = useRef<HTMLFormElement>(null);
  const [showToast, setShowToast] = useState(false);
  const prevState = useRef(state.success);

  useEffect(() => {
    if (!prevState.current && state.success) {
      setShowToast(true);
      formRef.current?.reset();
      const timer = setTimeout(() => setShowToast(false), 5100);
      return () => clearTimeout(timer);
    }
    prevState.current = state.success;
  }, [state.success]);

  return (
    <>
      {showToast && <Toast message="Message sent!" />}
      <form ref={formRef} action={isLoggedIn ? formAction : undefined} className="bg-surface border border-border rounded-lg p-8 shadow-sm flex flex-col gap-6">
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

      {isLoggedIn ? (
        <SubmitButton pendingText="Sending...">
          Send Message
        </SubmitButton>
      ) : (
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background text-center w-full min-h-[40px]"
        >
          Log in to send message
        </Link>
      )}
    </form>
    </>
  );
}
