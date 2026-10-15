"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Loader2, X } from "lucide-react";
import { FileUpload } from "@/components/ui/file-upload";
import { fetchYoutubeVideoDuration } from "@/app/actions/youtube";
import { Toast } from "@/components/ui/toast";

type Resource = {
  url: string;
  label: string;
};

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  youtube_url: string;
  pdf_url: string;
  duration_min: number;
  order_index: number;
};

// Parse the pdf_url column value into a typed Resource array.
// Supports:
//   - JSON array: [{"url":"...","label":"..."}]  (new format)
//   - Plain string URL                           (legacy single-PDF format)
//   - Empty / null                               (no resources)
function parseResources(raw: string | null | undefined): Resource[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed as Resource[];
    } catch {
      // fall through to legacy handling
    }
  }
  // Legacy plain-URL string — treat as a single resource with default label
  return [{ url: trimmed, label: "" }];
}

function serializeResources(resources: Resource[]): string {
  if (resources.length === 0) return "";
  return JSON.stringify(resources);
}

export function LessonsManager({ courseId }: { courseId: string }) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<Partial<Lesson> | null>(null);
  // Resources being edited (parsed from isEditing.pdf_url)
  const [resources, setResources] = useState<Resource[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isFetchingDuration, setIsFetchingDuration] = useState(false);
  const [durationError, setDurationError] = useState("");
  const supabase = createClient();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isSaving) {
      timeoutId = setTimeout(() => setShowLoading(true), 200);
    } else {
      setShowLoading(false);
    }
    return () => clearTimeout(timeoutId);
  }, [isSaving]);

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

  const handleFetchDuration = async () => {
    if (!isEditing?.youtube_url) {
      setDurationError("Please enter a YouTube URL first");
      return;
    }

    setDurationError("");
    setIsFetchingDuration(true);

    try {
      const result = await fetchYoutubeVideoDuration(isEditing.youtube_url);
      if (result.error) {
        setDurationError(result.error);
      } else if (result.duration !== undefined) {
        setIsEditing(prev => prev ? { ...prev, duration_min: result.duration } : prev);
      }
    } catch (err) {
      setDurationError("Failed to fetch duration");
    } finally {
      setIsFetchingDuration(false);
    }
  };

  // Open the edit form, seeding the resources state from the lesson's pdf_url
  const openEdit = (lesson: Partial<Lesson>) => {
    setResources(parseResources(lesson.pdf_url));
    setIsEditing(lesson);
  };

  const addResource = () => {
    setResources(prev => [...prev, { url: "", label: "" }]);
  };

  const updateResource = (index: number, field: keyof Resource, value: string) => {
    setResources(prev => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const removeResource = (index: number) => {
    setResources(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSuccess = (index: number, url: string) => {
    setResources(prev => prev.map((r, i) => (i === index ? { ...r, url } : r)));
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) return;

    setIsSaving(true);

    // Only persist resources that have a URL
    const validResources = resources.filter(r => r.url.trim() !== "");

    const payload = {
      course_id: courseId,
      title: isEditing.title || "",
      youtube_url: isEditing.youtube_url || "",
      pdf_url: serializeResources(validResources),
      duration_min: isEditing.duration_min ? parseInt(isEditing.duration_min.toString()) : 0,
      order_index: isEditing.order_index ?? lessons.length,
    };

    if (isEditing.id) {
      const { error } = await supabase.from("lessons").update(payload).eq("id", isEditing.id);
      if (!error) {
        setLessons(lessons.map(l => l.id === isEditing.id ? { ...l, ...payload } as Lesson : l));
        setIsEditing(null);
        setResources([]);
        setToastMessage("Lesson updated successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5100);
      } else {
        alert("Error updating lesson");
      }
    } else {
      const { data, error } = await supabase.from("lessons").insert(payload).select().single();
      if (!error && data) {
        setLessons([...lessons, data as Lesson]);
        setIsEditing(null);
        setResources([]);
        setToastMessage("Lesson created successfully!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5100);
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

  const moveLesson = async (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === lessons.length - 1) return;

    const newLessons = [...lessons];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

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
    <>
      {showToast && <Toast message={toastMessage} />}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Lessons</h2>
          {!isEditing && (
            <button
              onClick={() => openEdit({})}
              className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-3 py-1.5 rounded-md hover:bg-[var(--background)] transition-colors duration-200 text-sm font-medium"
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
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  min="0"
                  value={isEditing.duration_min || ""}
                  onChange={(e) => setIsEditing({ ...isEditing, duration_min: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-200"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--muted)] mb-1">YouTube URL</label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={isEditing.youtube_url || ""}
                      onChange={(e) => {
                        setIsEditing({ ...isEditing, youtube_url: e.target.value });
                        if (durationError) setDurationError("");
                      }}
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-md px-3 py-2 text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-200"
                    />
                    {durationError && <p className="text-red-500 text-xs mt-1">{durationError}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={handleFetchDuration}
                    disabled={isFetchingDuration || !isEditing.youtube_url}
                    className="flex items-center justify-center min-w-[140px] bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] px-3 py-2 rounded-md hover:bg-[var(--background)] transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                  >
                    {isFetchingDuration ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Fetching...
                      </>
                    ) : (
                      "Fetch Duration"
                    )}
                  </button>
                </div>
              </div>

              {/* ── Multi-resource PDF section ── */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[var(--muted)]">
                    Lesson Resources (PDFs)
                  </label>
                  <button
                    type="button"
                    onClick={addResource}
                    className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline"
                  >
                    <Plus size={14} />
                    Add Resource
                  </button>
                </div>

                {resources.length === 0 ? (
                  <p className="text-xs text-[var(--muted)] italic">
                    No resources added. Click &quot;Add Resource&quot; to attach PDFs.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {resources.map((resource, index) => (
                      <div
                        key={index}
                        className="border border-[var(--border)] rounded-md p-3 bg-[var(--background)] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-[var(--muted)]">
                            Resource {index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeResource(index)}
                            className="text-red-500 hover:text-red-400 transition-colors duration-200"
                            title="Remove resource"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* Label input */}
                        <div>
                          <label className="block text-xs text-[var(--muted)] mb-1">
                            Label{" "}
                            <span className="font-normal opacity-60">
                              (shown on the resource card — defaults to &quot;Lesson PDF&quot; if empty)
                            </span>
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. DBMS Unit 1 Notes"
                            value={resource.label}
                            onChange={(e) => updateResource(index, "label", e.target.value)}
                            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-1.5 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none transition-colors duration-200"
                          />
                        </div>

                        {/* File / URL */}
                        {resource.url ? (
                          <div className="flex items-center justify-between p-2 bg-[var(--surface)] border border-[var(--border)] rounded-md">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[var(--accent)] hover:underline truncate max-w-[300px] text-sm"
                            >
                              {resource.url.split("/").pop()}
                            </a>
                            <button
                              type="button"
                              onClick={() => updateResource(index, "url", "")}
                              className="text-red-500 hover:text-red-400 text-xs font-medium ml-2 shrink-0"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <FileUpload
                            bucket="lesson-notes"
                            accept="application/pdf"
                            onUploadSuccess={(url) => handleUploadSuccess(index, url)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* ── End multi-resource section ── */}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setIsEditing(null); setResources([]); }}
                className="px-4 py-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center px-4 py-2 text-sm bg-accent text-background font-medium rounded-md hover:bg-opacity-90 transition-colors duration-200 disabled:opacity-50 min-w-[120px]"
              >
                {showLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isEditing.id ? "Save Changes" : "Add Lesson"}
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
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-md group hover:border-[var(--muted)] transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveLesson(index, "up")} disabled={index === 0} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30">
                        <ChevronUp size={16} />
                      </button>
                      <button onClick={() => moveLesson(index, "down")} disabled={index === lessons.length - 1} className="text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <div>
                      <div className="font-medium text-[var(--foreground)]">{lesson.title}</div>
                      <div className="text-xs text-[var(--muted)]">
                        {lesson.duration_min || 0} mins
                        {parseResources(lesson.pdf_url).length > 0 && (
                          <span className="ml-2 opacity-60">
                            · {parseResources(lesson.pdf_url).length} resource{parseResources(lesson.pdf_url).length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(lesson)} className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-200" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(lesson.id)} className="p-1.5 text-[var(--muted)] hover:text-red-500 transition-colors duration-200" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
