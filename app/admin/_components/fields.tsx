"use client";

import { useState, type ReactNode } from "react";
import { uploadImage } from "@/app/admin/actions";
import { Plus, Save, Upload, X } from "./icons";

const inputClass =
  "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-400";

const labelClass =
  "block text-xs font-medium text-slate-600 dark:text-slate-400";

type TextFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url" | "tel";
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function TextField({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  className,
}: TextFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

type TextareaFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function TextareaField({
  label,
  name,
  value,
  onChange,
  rows = 3,
  required,
  placeholder,
  className,
}: TextareaFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

type NumberFieldProps = {
  label: string;
  name: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  required?: boolean;
  className?: string;
};

function parseNumber(raw: string): number | null {
  if (raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function NumberField({
  label,
  name,
  value,
  onChange,
  min,
  max,
  required,
  className,
}: NumberFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(parseNumber(e.target.value))}
        min={min}
        max={max}
        required={required}
        className={inputClass}
      />
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
};

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  className,
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type ListFieldProps<T> = {
  label: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number, remove: () => void) => ReactNode;
  addLabel?: string;
  emptyHint?: string;
  className?: string;
};

export function ListField<T>({
  label,
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = "Add",
  emptyHint,
  className,
}: ListFieldProps<T>) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <span className={labelClass}>{label}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      <div className="mt-2 space-y-2">
        {items.length === 0 && emptyHint ? (
          <p className="rounded border border-dashed border-slate-300 px-3 py-3 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
            {emptyHint}
          </p>
        ) : null}
        {items.map((item, i) => (
          <div
            key={i}
            className="relative rounded border border-slate-200 bg-slate-50/60 p-4 pr-10 dark:border-slate-800 dark:bg-slate-950/40"
          >
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label={`Remove ${label} entry ${i + 1}`}
              title="Remove"
              className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {renderItem(item, i, () => onRemove(i))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 inline-flex items-center gap-1.5 rounded border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-50"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}

type TagInputProps = {
  label: string;
  name: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  className?: string;
};

export function TagInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  className,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  function commit() {
    const pieces = draft
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (pieces.length === 0) {
      setDraft("");
      return;
    }
    onChange([...value, ...pieces]);
    setDraft("");
  }

  return (
    <div className={className}>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <div
        className="mt-1 flex flex-wrap gap-1.5 rounded border border-slate-300 bg-white px-2 py-1.5 text-sm transition focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:border-slate-400 dark:focus-within:ring-slate-400"
      >
        {value.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              aria-label={`Remove ${tag}`}
              className="inline-flex h-3.5 w-3.5 items-center justify-center text-slate-500 transition hover:text-slate-900 dark:hover:text-slate-50"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={name}
          name={name}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (
              e.key === "Backspace" &&
              draft === "" &&
              value.length > 0
            ) {
              e.preventDefault();
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder={placeholder}
          className="min-w-[8ch] flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-50"
        />
      </div>
    </div>
  );
}

type YearRangeFieldProps = {
  label: string;
  startName: string;
  endName: string;
  startValue: number;
  endValue: number;
  onStartChange: (value: number | null) => void;
  onEndChange: (value: number | null) => void;
  min?: number;
  max?: number;
  className?: string;
};

export function YearRangeField({
  label,
  startName,
  endName,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  min,
  max,
  className,
}: YearRangeFieldProps) {
  return (
    <div className={className}>
      <span className={labelClass}>{label}</span>
      <div className="mt-1 grid grid-cols-2 gap-2">
        <div>
          <label
            htmlFor={startName}
            className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500"
          >
            Start
          </label>
          <input
            id={startName}
            name={startName}
            type="number"
            value={startValue ?? ""}
            onChange={(e) => onStartChange(parseNumber(e.target.value))}
            min={min}
            max={max}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-400 dark:focus:ring-slate-400"
          />
        </div>
        <div>
          <label
            htmlFor={endName}
            className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500"
          >
            End
          </label>
          <input
            id={endName}
            name={endName}
            type="number"
            value={endValue ?? ""}
            onChange={(e) => onEndChange(parseNumber(e.target.value))}
            min={min}
            max={max}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-400 dark:focus:ring-slate-400"
          />
        </div>
      </div>
    </div>
  );
}

type ImageUploadFieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (url: string) => void;
  subdir?: "avatars" | "projects";
  className?: string;
};

export function ImageUploadField({
  label,
  name,
  value,
  onChange,
  subdir = "avatars",
  className,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("subdir", subdir);
      const res = await uploadImage(fd);
      if (res.ok) {
        onChange(res.url);
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={className}>
      <span className={labelClass}>{label}</span>
      <div className="mt-2 flex items-start gap-4">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-24 w-24 rounded border border-slate-200 object-cover dark:border-slate-800"
          />
        ) : (
          <div className="grid h-24 w-24 place-items-center rounded border border-dashed border-slate-300 text-[10px] uppercase tracking-wide text-slate-400 dark:border-slate-700 dark:text-slate-500">
            no image
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 ${
              uploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Replace"}
            <input
              type="file"
              name={name}
              accept="image/*"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
              className="hidden"
            />
          </label>
          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setError(null);
              }}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          ) : null}
        </div>
      </div>
      {error ? (
        <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : null}
    </div>
  );
}

type SectionProps = {
  title: string;
  description?: string;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  ok: boolean;
  children: ReactNode;
};

export function Section({
  title,
  description,
  onSave,
  saving,
  error,
  ok,
  children,
}: SectionProps) {
  return (
    <details
      open
      className="group rounded border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-slate-800 marker:hidden dark:text-slate-100 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span className="text-xs font-normal text-slate-400 transition group-open:rotate-180">
          ▾
        </span>
      </summary>
      {description ? (
        <p className="border-b border-slate-200 px-4 pb-3 pt-1 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {description}
        </p>
      ) : null}
      <div className="space-y-3 px-4 py-4">{children}</div>
      <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="min-h-[1rem] text-xs">
          {error ? (
            <span className="text-rose-600 dark:text-rose-400">{error}</span>
          ) : ok ? (
            <span className="text-emerald-600 dark:text-emerald-400">Saved</span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-50 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-white"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving…" : ok ? "Saved ✓" : "Save"}
        </button>
      </div>
    </details>
  );
}
