"use client";

import { profile } from "@/lib/content";

interface SidebarProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export default function Sidebar({ selectedTags, onToggleTag }: SidebarProps) {
  const allTags = Array.from(
    new Set([
      ...profile.experience.flatMap((e) => e.tags),
      ...profile.projects.flatMap((p) => p.tags),
    ])
  ).sort();

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Contact
        </h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="block truncate text-slate-700 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
              className="block text-slate-700 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
            >
              {profile.phone}
            </a>
          </li>
          <li className="text-slate-600 dark:text-slate-400">{profile.location}</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Summary
        </h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {profile.summary}
        </p>
      </div>

      <div className="card">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Skills
        </h2>
        <div className="space-y-3">
          {profile.skills.map(({ category, items }) => (
            <div key={category}>
              <p className="mb-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                {category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {items.map((skill) => (
                  <span
                    key={skill}
                    className="badge border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card no-print">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Filter by Tag
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => onToggleTag(tag)}
                aria-pressed={active}
                className={`badge cursor-pointer transition ${
                  active
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
