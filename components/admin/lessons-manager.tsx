"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  youtube_url: string;
  pdf_url: string;
  duration: number;
  order_index: number;
};

export function LessonsManager({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Partial<Lesson> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });
    
    if (data) setLessons(data);
    setLoading(false);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;
    
    setIsSaving(true);
    const payload = {
      course_id: courseId,
      title: isEditing.title || "",
      youtube_url: isEditing.youtube_url || "",
      pdf_url: isEditing.pdf_url || "",
      duration: isEditing.duration ? parseInt(isEditing.duration.toString()) : 0,
      order_index: isEditing.order_index ?? lessons.length,
    };

    if (isEditing.id) {
      const { error } = await supabase.from("lessons").update(payload).eq("id", isEditing.id);
      if (!error) {
        setLessons(lessons.map(l => l.id === isEditing.id ? { ...l, ...payload } as Lesson : l));
        setIsEditing(null);
      } else {
        alert("Error updating lesson");
      }
    } else {
      const { data, error } = await supabase.from("lessons").insert(payload).select().single();
      if (!error && data) {
        setLessons([...lessons, data as Lesson]);
        setIsEditing(null);
      } else {
        alert("Error creating lesson");
      }
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (!error) {
      setLessons(lessons.filter(l => l.id !== id));
    } else {
      alert("Error deleting lesson");
    }
  };

  const moveLesson = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === lessons.length - 1) return;

    const newLessons = [...lessons];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    const temp = newLessons[index];
    newLessons[index] = newLessons[swapIndex];
    newLessons[swapIndex] = temp;

    const updatedLessons = newLessons.map((l, i) => ({ ...l, order_index: i }));
    setLessons(updatedLessons);

    for (const l of updatedLessons) {
      await supabase.from("lessons").update({ order_index: l.order_index }).eq("id", l.id);
    }
  };

  if (loading) return <div className="text-[var(--muted)]">Loading lessons...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--foreground)]">Lessons</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing({})}
            className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-3 py-1.5 rounded-md hover:bg-[var(--background)] transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Add Lesson
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveLesson} className="bg-[var(--surface)] p-4 rounded-md border border-[var(--border)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Title</label>
              <input
                required
                type="text"
                value={isEditing.title || ""}
                onChange={(e) => setIsEditing({ ...isEditing, title: e.target.value })}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Duration (minutes)</label>
              <input
                type="number"
                min="0"
                value={isEditing.duration || ""}
                onChange={(e) => setIsEditing({ ...isEditing, duration: parseInt(e.target.value) || 0 })}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">YouTube URL</label>
              <input
                type="url"
                value={isEditing.youtube_url || ""}
                onChange={(e) => setIsEditing({ ...isEditing, youtube_url: e.target.value })}
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--muted)] mb-1">Lesson Notes (PDF)</label>
              {isEditing.pdf_url ? (
                <div className="flex items-center justify-between p-3 bg-[var(--background)] border border-[var(--border)] rounded-md">
                  <a href={isEditing.pdf_url} target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline truncate max-w-[300px]">
                    {isEditing.pdf_url.split('/').pop()}
                  </a>
                  <button type="button" onClick={() => setIsEditing({ ...isEditing, pdf_url: "" })} className="text-red-500 hover:text-red-400 text-sm font-medium">
                    Remove
                  </button>
                </div>
              ) : (
                <FileUpload
                  bucket="lesson-notes"
                  accept="application/pdf"
                  onUploadSuccess={(url) => setIsEditing({ ...isEditing, pdf_url: url })}
                />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(null)}
              className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-[var(--accent)] text-black font-medium rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isSaving ? "Saving..." : isEditing.id ? "Save Changes" : "Add Lesson"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          {lessons.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] rounded-md">
              No lessons added yet.
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-md group hover:border-[var(--muted)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveLesson(index, 'up')} disabled={index === 0} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30">
                      <ChevronUp size={16} />
                    </button>
                    <button onClick={() => moveLesson(index, 'down')} disabled={index === lessons.length - 1} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30">
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div>
                    <div className="font-medium text-[var(--foreground)]">{lesson.title}</div>
                    <div className="text-xs text-[var(--muted)]">{lesson.duration || 0} mins</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsEditing(lesson)} className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDelete(lesson.id)} className="p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
