import { profile } from "@/lib/content";

export default function CertificationsBadge() {
  const earned = profile.certifications.filter((c) => c.status === "earned");
  const inView = profile.certifications.filter((c) => c.status === "in_view");

  return (
    <div className="card">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
        Certifications
      </h2>

      <ul className="space-y-2.5">
        {earned.map((cert, i) => (
          <li key={`e-${i}`} className="flex items-start gap-2.5">
            <span className="mt-1 inline-flex h-5 shrink-0 items-center rounded-full bg-emerald-100 px-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
              Earned
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {cert.name}
              </p>
              {cert.year && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {cert.year}
                </p>
              )}
            </div>
          </li>
        ))}

        {inView.length > 0 && earned.length > 0 && (
          <li className="my-3 border-t border-slate-200 dark:border-slate-800" />
        )}

        {inView.map((cert, i) => (
          <li key={`v-${i}`} className="flex items-start gap-2.5">
            <span className="mt-1 inline-flex h-5 shrink-0 items-center rounded-full bg-amber-100 px-2 text-[10px] font-semibold uppercase tracking-wider text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
              In view
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {cert.name}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
