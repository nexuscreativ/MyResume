"use client";

import type {
  Certification,
  Education,
  Experience,
  Project,
  Referee,
  SkillCategory,
  SocialLink,
  SocialPlatform,
} from "@/types/site";
import {
  ListField,
  NumberField,
  SelectField,
  TagInput,
  TextField,
  TextareaField,
  YearRangeField,
} from "./fields";

type CardProps<T> = {
  item: T;
  onChange: (next: T) => void;
};

export function ExperienceCard({ item, onChange }: CardProps<Experience>) {
  return (
    <div className="space-y-3">
      <TextField
        label="Role"
        name="role"
        value={item.role}
        onChange={(role) => onChange({ ...item, role })}
      />
      <TextField
        label="Company"
        name="company"
        value={item.company}
        onChange={(company) => onChange({ ...item, company })}
      />
      <TextField
        label="Years (display string)"
        name="years"
        value={item.years}
        onChange={(years) => onChange({ ...item, years })}
        placeholder="e.g. 2020 – Present"
      />
      <YearRangeField
        label="Year range"
        startName="yearStart"
        endName="yearEnd"
        startValue={item.yearStart}
        endValue={item.yearEnd}
        onStartChange={(n) =>
          onChange({ ...item, yearStart: n ?? new Date().getFullYear() })
        }
        onEndChange={(n) =>
          onChange({ ...item, yearEnd: n ?? new Date().getFullYear() })
        }
      />
      <ListField
        label="Highlights"
        items={item.highlights}
        onAdd={() => onChange({ ...item, highlights: [...item.highlights, ""] })}
        onRemove={(i) =>
          onChange({
            ...item,
            highlights: item.highlights.filter((_, idx) => idx !== i),
          })
        }
        renderItem={(h, i) => (
          <TextareaField
            label={`Highlight ${i + 1}`}
            name={`highlight-${i}`}
            value={h}
            onChange={(v) =>
              onChange({
                ...item,
                highlights: item.highlights.map((h2, idx) =>
                  idx === i ? v : h2
                ),
              })
            }
            rows={2}
          />
        )}
        addLabel="Add highlight"
        emptyHint="No highlights yet."
      />
      <TagInput
        label="Tags"
        name="tags"
        value={item.tags}
        onChange={(tags) => onChange({ ...item, tags })}
        placeholder="press enter or comma"
      />
    </div>
  );
}

export function EducationCard({ item, onChange }: CardProps<Education>) {
  return (
    <div className="space-y-3">
      <TextField
        label="Degree"
        name="degree"
        value={item.degree}
        onChange={(degree) => onChange({ ...item, degree })}
      />
      <TextField
        label="School"
        name="school"
        value={item.school}
        onChange={(school) => onChange({ ...item, school })}
      />
      <NumberField
        label="Year"
        name="year"
        value={item.year}
        onChange={(year) =>
          onChange({ ...item, year: year ?? new Date().getFullYear() })
        }
      />
    </div>
  );
}

export function SkillCategoryCard({
  item,
  onChange,
}: CardProps<SkillCategory>) {
  return (
    <div className="space-y-3">
      <TextField
        label="Category"
        name="category"
        value={item.category}
        onChange={(category) => onChange({ ...item, category })}
      />
      <TagInput
        label="Items"
        name="items"
        value={item.items}
        onChange={(items) => onChange({ ...item, items })}
        placeholder="press enter or comma"
      />
    </div>
  );
}

export function CertificationCard({
  item,
  onChange,
}: CardProps<Certification>) {
  return (
    <div className="space-y-3">
      <TextField
        label="Name"
        name="name"
        value={item.name}
        onChange={(name) => onChange({ ...item, name })}
      />
      <NumberField
        label="Year (leave empty for in-progress)"
        name="year"
        value={item.year}
        onChange={(year) => onChange({ ...item, year })}
      />
      <SelectField
        label="Status"
        name="status"
        value={item.status}
        onChange={(v) =>
          onChange({ ...item, status: v as Certification["status"] })
        }
        options={[
          { label: "Earned", value: "earned" },
          { label: "In view", value: "in_view" },
        ]}
      />
    </div>
  );
}

export function ProjectCard({ item, onChange }: CardProps<Project>) {
  return (
    <div className="space-y-3">
      <TextField
        label="Title"
        name="title"
        value={item.title}
        onChange={(title) => onChange({ ...item, title })}
      />
      <TextareaField
        label="Tech"
        name="tech"
        value={item.tech}
        onChange={(tech) => onChange({ ...item, tech })}
        rows={2}
      />
      <TextareaField
        label="Impact"
        name="impact"
        value={item.impact}
        onChange={(impact) => onChange({ ...item, impact })}
        rows={3}
      />
      <TagInput
        label="Tags"
        name="tags"
        value={item.tags}
        onChange={(tags) => onChange({ ...item, tags })}
        placeholder="press enter or comma"
      />
    </div>
  );
}

export function RefereeCard({ item, onChange }: CardProps<Referee>) {
  return (
    <div className="space-y-3">
      <TextField
        label="Name"
        name="name"
        value={item.name}
        onChange={(name) => onChange({ ...item, name })}
      />
      <TextField
        label="Organization"
        name="org"
        value={item.org}
        onChange={(org) => onChange({ ...item, org })}
      />
      <TextField
        label="Phone"
        name="phone"
        value={item.phone}
        onChange={(phone) => onChange({ ...item, phone })}
        placeholder="optional"
      />
    </div>
  );
}

const PLATFORM_OPTIONS: { label: string; value: SocialPlatform }[] = [
  { label: "LinkedIn", value: "linkedin" },
  { label: "GitHub", value: "github" },
  { label: "Twitter / X", value: "twitter" },
  { label: "YouTube", value: "youtube" },
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "Mastodon", value: "mastodon" },
  { label: "Bluesky", value: "bluesky" },
  { label: "Email", value: "email" },
  { label: "Website", value: "website" },
];

export function SocialCard({ item, onChange }: CardProps<SocialLink>) {
  return (
    <div className="space-y-3">
      <SelectField
        label="Platform"
        name="platform"
        value={item.platform}
        onChange={(v) => onChange({ ...item, platform: v as SocialPlatform })}
        options={PLATFORM_OPTIONS}
      />
      <TextField
        label="URL"
        name="url"
        value={item.url}
        onChange={(url) => onChange({ ...item, url })}
        type="url"
        placeholder={
          item.platform === "email"
            ? "mailto:you@example.com"
            : "https://..."
        }
      />
      <TextField
        label="Accessible label (optional)"
        name="label"
        value={item.label ?? ""}
        onChange={(label) =>
          onChange({ ...item, label: label || undefined })
        }
        placeholder="e.g. LinkedIn profile"
      />
    </div>
  );
}
