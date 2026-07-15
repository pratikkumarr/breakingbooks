"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string, redirectPath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to enroll");
  }

  // Check if already enrolled to avoid unique constraint errors if the button was clicked twice
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (!existing) {
    const { error } = await supabase
      .from("enrollments")
      .insert({ user_id: user.id, course_id: courseId });

    if (error) {
      console.error("Enrollment error:", error);
      throw new Error("Failed to enroll");
    }
  }

  revalidatePath(redirectPath);
}

export async function toggleLessonProgress(lessonId: string, completed: boolean, redirectPath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Must be logged in to save progress");
  }

  const { data: existing } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .single();

  if (existing) {
    await supabase
      .from("lesson_progress")
      .update({ completed })
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
  } else {
    await supabase
      .from("lesson_progress")
      .insert({ user_id: user.id, lesson_id: lessonId, completed });
  }

  revalidatePath(redirectPath);
}
