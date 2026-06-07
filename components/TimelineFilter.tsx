interface TimelineFilterProps {
  minYear: number;
  maxYear: number;
  onMinChange: (year: number) => void;
  onMaxChange: (year: number) => void;
  min: number;
  max: number;
}

export default function TimelineFilter({
  minYear,
  maxYear,
  onMinChange,
  onMaxChange,
  min,
  max,
}: TimelineFilterProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
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
        className="text-slate-400"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Timeline
      </span>
      <input
        type="number"
        min={min}
        max={maxYear}
        value={minYear}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) {
            onMinChange(Math.min(v, maxYear));
          }
        }}
        className="w-16 rounded border border-slate-200 bg-transparent px-1.5 py-0.5 text-sm font-mono text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:text-slate-100"
        aria-label="Minimum year"
      />
      <span className="text-slate-400">–</span>
      <input
        type="number"
        min={minYear}
        max={max}
        value={maxYear}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) {
            onMaxChange(Math.max(v, minYear));
          }
        }}
        className="w-16 rounded border border-slate-200 bg-transparent px-1.5 py-0.5 text-sm font-mono text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:text-slate-100"
        aria-label="Maximum year"
      />
      <span className="hidden text-xs font-mono text-slate-500 sm:inline dark:text-slate-400">
        ({minYear} – {maxYear})
      </span>
    </div>
  );
}
