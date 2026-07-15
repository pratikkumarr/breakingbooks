"use client";

import { Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCourseButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course? This will also delete all associated lessons.")) return;

    setIsDeleting(true);
    const supabase = createClient();
    
    const { error } = await supabase.from("courses").delete().eq("id", id);
    
    if (error) {
      console.error(error);
      alert("Failed to delete course");
    } else {
      router.refresh();
    }
    setIsDeleting(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center p-2 rounded-md text-[var(--muted)] hover:text-red-500 hover:bg-[var(--background)] transition-colors disabled:opacity-50"
      title="Delete course"
    >
      <Trash2 size={18} />
    </button>
  );
}
