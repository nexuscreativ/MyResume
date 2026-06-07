interface SkillFilterProps {
  tags: string[];
  selected: string[];
  onToggle: (tag: string) => void;
}

export default function SkillFilter({ tags, selected, onToggle }: SkillFilterProps) {
  if (tags.length === 0) return null;

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
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
        Tags
      </span>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => {
          const active = selected.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => onToggle(tag)}
              aria-pressed={active}
              className={`rounded-full px-2 py-0.5 text-xs font-medium transition ${
                active
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
