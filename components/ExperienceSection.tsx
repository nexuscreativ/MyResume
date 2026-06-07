interface Experience {
  role: string;
  company: string;
  years: string;
  yearStart: number;
  yearEnd: number;
  highlights: string[];
  tags: string[];
}

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  return (
    <section>
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Experience
        </h2>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          {experience.length} {experience.length === 1 ? "role" : "roles"}
        </span>
      </div>

      {experience.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No experience matches the current filters.
          </p>
        </div>
      ) : (
        <div className="relative space-y-4">
          <div
            aria-hidden
            className="absolute bottom-4 left-[7px] top-4 w-px bg-slate-200 dark:bg-slate-800"
          />
          {experience.map((exp, i) => (
            <article
              key={i}
              className="card relative ml-6 cursor-default transition-transform duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <span
                aria-hidden
                className="absolute -left-[27px] top-7 h-3.5 w-3.5 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-900"
              />
              <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                    {exp.role}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {exp.company}
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {exp.years}
                </span>
              </div>
              <ul className="mb-3 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5">
                {exp.tags.map((t) => (
                  <span
                    key={t}
                    className="badge bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
