"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, Suspense } from "react";

function FiltersContent({ subjects }: { subjects: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [classLevel, setClassLevel] = useState(searchParams.get("class") || "all");
  const [subject, setSubject] = useState(searchParams.get("subject") || "all");
  const [q, setQ] = useState(searchParams.get("q") || "");

  const applyFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/courses?${params.toString()}`);
    },
    [searchParams, router]
  );

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassLevel(e.target.value);
    applyFilters("class", e.target.value);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
    applyFilters("subject", e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters("q", q);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-surface p-4 rounded-lg border border-border items-center">
      <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 w-full">
        <input 
          type="text" 
          placeholder="Search courses..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors"
        />
        <button type="submit" className="bg-accent text-background px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          Search
        </button>
      </form>
      
      <div className="flex gap-4 w-full sm:w-auto">
        <select 
          value={classLevel} 
          onChange={handleClassChange}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer flex-1 sm:flex-none"
        >
          <option value="all">All Classes</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>

        <select 
          value={subject} 
          onChange={handleSubjectChange}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-colors cursor-pointer flex-1 sm:flex-none min-w-[140px]"
        >
          <option value="all">All Subjects</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function CourseFilters({ subjects }: { subjects: string[] }) {
  return (
    <Suspense fallback={<div className="h-[72px] mb-8 bg-surface rounded-lg border border-border animate-pulse" />}>
      <FiltersContent subjects={subjects} />
    </Suspense>
  );
}
