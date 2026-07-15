"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface FileUploadProps {
  bucket: string;
  onUploadSuccess: (url: string) => void;
  accept?: string;
  className?: string;
}

export function FileUpload({ bucket, onUploadSuccess, accept = "image/*", className = "" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    const supabase = createClient();

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onUploadSuccess(publicUrl);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-[var(--border)] rounded-md cursor-pointer bg-[var(--surface)] hover:border-[var(--muted)] transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
          {isUploading ? (
            <Loader2 className="w-6 h-6 mb-2 text-[var(--accent)] animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6 mb-2 text-[var(--muted)]" />
          )}
          <p className="text-sm text-[var(--foreground)]">
            {isUploading ? "Uploading..." : "Click to upload"}
          </p>
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange} 
          disabled={isUploading}
        />
      </label>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
