"use client";

import { useMemo, useState } from "react";
import { profile } from "@/lib/content";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import CertificationsBadge from "@/components/CertificationsBadge";
import TimelineFilter from "@/components/TimelineFilter";
import SkillFilter from "@/components/SkillFilter";
import PDFExportButton from "@/components/PDFExportButton";

const MIN_YEAR = 1994;
const MAX_YEAR = 2025;

export default function Home() {
  const [minYear, setMinYear] = useState<number>(MIN_YEAR);
  const [maxYear, setMaxYear] = useState<number>(MAX_YEAR);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    profile.experience.forEach((exp) => exp.tags.forEach((t) => tagSet.add(t)));
    profile.projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, []);

  const filteredExperience = useMemo(() => {
    return profile.experience.filter((exp) => {
      const overlaps = exp.yearStart <= maxYear && exp.yearEnd >= minYear;
      const matchesTags =
        selectedTags.length === 0 ||
        exp.tags.some((t) => selectedTags.includes(t));
      return overlaps && matchesTags;
    });
  }, [minYear, maxYear, selectedTags]);

  const filteredProjects = useMemo(() => {
    return profile.projects.filter((p) => {
      const matchesTags =
        selectedTags.length === 0 || p.tags.some((t) => selectedTags.includes(t));
      return matchesTags;
    });
  }, [selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setMinYear(MIN_YEAR);
    setMaxYear(MAX_YEAR);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    minYear !== MIN_YEAR || maxYear !== MAX_YEAR || selectedTags.length > 0;

  return (
    <div className="min-h-screen">
      <Header />

      <div className="no-print sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <TimelineFilter
              minYear={minYear}
              maxYear={maxYear}
              onMinChange={setMinYear}
              onMaxChange={setMaxYear}
              min={MIN_YEAR}
              max={MAX_YEAR}
            />
            <SkillFilter
              tags={allTags}
              selected={selectedTags}
              onToggle={toggleTag}
            />
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Clear filters
              </button>
            )}
          </div>
          <PDFExportButton
            filename={`${profile.name.replace(/\s+/g, "-").toLowerCase()}-cv.pdf`}
          />
        </div>
      </div>

      <main className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <Sidebar selectedTags={selectedTags} onToggleTag={toggleTag} />
            <div className="mt-8">
              <CertificationsBadge />
            </div>
          </aside>

          <section className="lg:col-span-3" id="pdf-content">
            <ExperienceSection experience={filteredExperience} />
            <div className="mt-16">
              <ProjectsSection projects={filteredProjects} />
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              <div className="card">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Education
                </h3>
                <ul className="space-y-2 text-sm">
                  {profile.education.map((edu, i) => (
                    <li key={i} className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {edu.degree}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {edu.school}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-mono text-slate-500 dark:text-slate-400">
                        {edu.year}
                      </span>
                    </li>
                  ))}
                </ul>
                {profile.educationNote && (
                  <p className="mt-4 border-t border-slate-200 pt-3 text-xs italic text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    {profile.educationNote}
                  </p>
                )}
              </div>

              <div className="card">
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Interests & Languages
                </h3>
                <div className="mb-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i) => (
                      <span
                        key={i}
                        className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Languages
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.languages.map((l) => (
                      <span
                        key={l}
                        className="badge border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Referees
                  </p>
                  <ul className="space-y-2 text-sm">
                    {profile.referees.map((r, i) => (
                      <li key={i} className="text-slate-700 dark:text-slate-300">
                        <p className="font-medium">{r.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {r.org}
                          {r.phone && ` · ${r.phone}`}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-16 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, TailwindCSS, and html2pdf.js.
        </footer>
      </main>
    </div>
  );
}
