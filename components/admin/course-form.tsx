"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { FileUpload } from "@/components/ui/file-upload";

type Course = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  class_level: string;
  subject: string;
  published: boolean;
  thumbnail_url: string;
};

export function CourseForm({ initialData }: { initialData?: Partial<Course> }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Course>>(
    initialData || {
      title: "",
      slug: "",
      description: "",
      class_level: "",
      subject: "",
      published: false,
      thumbnail_url: "",
    }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      // Only auto-generate slug if we are creating a new course, or if slug is empty
      slug: !initialData?.id ? generateSlug(title) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const supabase = createClient();

    const payload = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description,
      class_level: formData.class_level,
      subject: formData.subject,
      published: formData.published,
      thumbnail_url: formData.thumbnail_url,
    };

    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("courses")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
        router.refresh();
      } else {
        const { data, error } = await supabase
          .from("courses")
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        router.push(`/admin/courses/${data.id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[var(--surface)] p-6 rounded-md border border-[var(--border)]">
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-900/50 text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Title</label>
            <input
              required
              type="text"
              value={formData.title || ""}
              onChange={handleTitleChange}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Slug</label>
            <input
              required
              type="text"
              value={formData.slug || ""}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Class Level</label>
            <input
              type="text"
              value={formData.class_level || ""}
              onChange={(e) => setFormData({ ...formData, class_level: e.target.value })}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject || ""}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Thumbnail</label>
            {formData.thumbnail_url ? (
              <div className="mb-2 relative w-full aspect-video rounded-md overflow-hidden border border-[var(--border)] group">
                <Image 
                  src={formData.thumbnail_url} 
                  alt="Thumbnail" 
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover" 
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, thumbnail_url: "" })}
                    className="text-white text-sm font-medium bg-red-500/80 px-3 py-1 rounded hover:bg-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <FileUpload 
                bucket="course-thumbnails" 
                onUploadSuccess={(url) => setFormData({ ...formData, thumbnail_url: url })} 
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--muted)] mb-1">Description</label>
            <textarea
              rows={4}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published || false}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] focus:ring-offset-[var(--background)] bg-[var(--background)] accent-[var(--accent)]"
            />
            <label htmlFor="published" className="text-sm font-medium text-[var(--foreground)]">
              Published
            </label>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[var(--border)] flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--accent)] text-black px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : initialData?.id ? "Save Changes" : "Create Course"}
        </button>
      </div>
    </form>
  );
}
