"use server";

import { createClient } from "@/utils/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to send a message." };
  }

  const name = formData.get("name") as string;
  const message = formData.get("message") as string;
  const email = user.email!;

  if (!name?.trim() || !message?.trim()) {
    return { success: false, error: "Name and message are required." };
  }

  // Insert into contact_messages table
  const { error: dbError } = await supabase
    .from("contact_messages")
    .insert({
      user_id: user.id,
      name: name.trim(),
      email: email,
      message: message.trim(),
    });

  if (dbError) {
    console.error("Error inserting contact message:", dbError);
    return { success: false, error: "Failed to save message." };
  }

  // Send email via Resend
  try {
    const { error: resendError } = await resend.emails.send({
      from: "Breaking Books <contact@breakingbooks.in>",
      to: "breakingbooks.pratik@gmail.com",
      subject: `New Contact Message from ${name.trim()}`,
      text: `You have received a new message from ${name.trim()} (${email}):\n\n${message.trim()}`,
    });

    if (resendError) {
      console.error("Resend error:", resendError);
      return { success: false, error: "Failed to send email notification." };
    }
  } catch (err) {
    console.error("Resend exception:", err);
    return { success: false, error: "Failed to send email notification." };
  }

  return { success: true, error: null };
}
