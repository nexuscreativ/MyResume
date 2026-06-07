"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteData } from "@/types/site";
import { saveSection } from "@/app/admin/actions";
import {
  ImageUploadField,
  ListField,
  Section,
  TagInput,
  TextField,
  TextareaField,
} from "./fields";
import {
  CertificationCard,
  EducationCard,
  ExperienceCard,
  ProjectCard,
  RefereeCard,
  SkillCategoryCard,
  SocialCard,
} from "./cards";

type SectionKey =
  | "profile"
  | "avatar"
  | "experience"
  | "education"
  | "educationNote"
  | "skills"
  | "certifications"
  | "projects"
  | "interests"
  | "languages"
  | "referees"
  | "social";

type SectionState = { saving: boolean; error: string | null; ok: boolean };

const SECTION_KEYS: readonly SectionKey[] = [
  "profile",
  "avatar",
  "experience",
  "education",
  "educationNote",
  "skills",
  "certifications",
  "projects",
  "interests",
  "languages",
  "referees",
  "social",
];

const OK_DISMISS_MS = 3000;

function makeInitialState(): Record<SectionKey, SectionState> {
  const out = {} as Record<SectionKey, SectionState>;
  for (const k of SECTION_KEYS) {
    out[k] = { saving: false, error: null, ok: false };
  }
  return out;
}

export default function EditForm({
  initial,
  mode,
}: {
  initial: SiteData;
  mode: "local" | "github";
}) {
  const [site, setSite] = useState<SiteData>(initial);
  const [state, setState] = useState<Record<SectionKey, SectionState>>(
    makeInitialState
  );
  const timers = useRef<
    Partial<Record<SectionKey, ReturnType<typeof setTimeout>>>
  >({});

  useEffect(() => {
    const captured = timers.current;
    return () => {
      for (const k of SECTION_KEYS) {
        const t = captured[k];
        if (t) clearTimeout(t);
      }
    };
  }, []);

  async function handleSave(key: SectionKey, payload: unknown) {
    const existing = timers.current[key];
    if (existing) clearTimeout(existing);

    setState((s) => ({
      ...s,
      [key]: { saving: true, error: null, ok: false },
    }));

    const res = await saveSection(key, payload);
    if (res.ok) {
      setState((s) => ({
        ...s,
        [key]: { saving: false, error: null, ok: true },
      }));
      timers.current[key] = setTimeout(() => {
        setState((s) => {
          if (!s[key].ok) return s;
          return { ...s, [key]: { ...s[key], ok: false } };
        });
      }, OK_DISMISS_MS);
    } else {
      setState((s) => ({
        ...s,
        [key]: { saving: false, error: res.error, ok: false },
      }));
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Edit site
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Persistence:{" "}
          <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">
            {mode === "local" ? "local file system" : "GitHub API"}
          </code>
          {mode === "github"
            ? ". Each save commits to your repo and triggers a Vercel rebuild."
            : "."}
        </p>
      </header>

      <Section
        title="Profile"
        saving={state.profile.saving}
        error={state.profile.error}
        ok={state.profile.ok}
        onSave={() =>
          handleSave("profile", {
            name: site.name,
            title: site.title,
            location: site.location,
            email: site.email,
            phone: site.phone,
            summary: site.summary,
          })
        }
      >
        <TextField
          label="Full name"
          name="profile.name"
          value={site.name}
          onChange={(v) => setSite({ ...site, name: v })}
        />
        <TextField
          label="Headline"
          name="profile.title"
          value={site.title}
          onChange={(v) => setSite({ ...site, title: v })}
        />
        <TextField
          label="Location"
          name="profile.location"
          value={site.location}
          onChange={(v) => setSite({ ...site, location: v })}
        />
        <TextField
          label="Email"
          name="profile.email"
          type="email"
          value={site.email}
          onChange={(v) => setSite({ ...site, email: v })}
        />
        <TextField
          label="Phone"
          name="profile.phone"
          value={site.phone}
          onChange={(v) => setSite({ ...site, phone: v })}
        />
        <TextareaField
          label="Summary"
          name="profile.summary"
          value={site.summary}
          onChange={(v) => setSite({ ...site, summary: v })}
          rows={5}
        />
      </Section>

      <Section
        title="Avatar"
        saving={state.avatar.saving}
        error={state.avatar.error}
        ok={state.avatar.ok}
        onSave={() => handleSave("avatar", { avatar: site.avatar })}
      >
        <ImageUploadField
          label="Avatar / headshot"
          name="profile.avatar"
          value={site.avatar}
          onChange={(url) => setSite({ ...site, avatar: url })}
        />
      </Section>

      <Section
        title="Experience"
        saving={state.experience.saving}
        error={state.experience.error}
        ok={state.experience.ok}
        onSave={() => handleSave("experience", site.experience)}
      >
        <ListField
          label="Experience entries"
          items={site.experience}
          onAdd={() =>
            setSite({
              ...site,
              experience: [
                ...site.experience,
                {
                  role: "",
                  company: "",
                  years: "",
                  yearStart: new Date().getFullYear(),
                  yearEnd: new Date().getFullYear(),
                  highlights: [],
                  tags: [],
                },
              ],
            })
          }
          onRemove={(i) =>
            setSite({
              ...site,
              experience: site.experience.filter((_, idx) => idx !== i),
            })
          }
          renderItem={(item, i) => (
            <ExperienceCard
              item={item}
              onChange={(updated) =>
                setSite({
                  ...site,
                  experience: site.experience.map((e, idx) =>
                    idx === i ? updated : e
                  ),
                })
              }
            />
          )}
          addLabel="Add experience"
          emptyHint="No experience entries yet."
        />
      </Section>

      <Section
        title="Education"
        saving={state.education.saving}
        error={state.education.error}
        ok={state.education.ok}
        onSave={() => handleSave("education", site.education)}
      >
        <ListField
          label="Education entries"
          items={site.education}
          onAdd={() =>
            setSite({
              ...site,
              education: [
                ...site.education,
                { degree: "", school: "", year: new Date().getFullYear() },
              ],
            })
          }
          onRemove={(i) =>
            setSite({
              ...site,
              education: site.education.filter((_, idx) => idx !== i),
            })
          }
          renderItem={(item, i) => (
            <EducationCard
              item={item}
              onChange={(updated) =>
                setSite({
                  ...site,
                  education: site.education.map((e, idx) =>
                    idx === i ? updated : e
                  ),
                })
              }
            />
          )}
          addLabel="Add education"
          emptyHint="No education entries yet."
        />
      </Section>

      <Section
        title="Education note"
        description="Free-form note displayed after the education list (e.g. school transfers)."
        saving={state.educationNote.saving}
        error={state.educationNote.error}
        ok={state.educationNote.ok}
        onSave={() =>
          handleSave("educationNote", { educationNote: site.educationNote })
        }
      >
        <TextareaField
          label="Note"
          name="educationNote"
          value={site.educationNote}
          onChange={(v) => setSite({ ...site, educationNote: v })}
          rows={3}
        />
      </Section>

      <Section
        title="Skills"
        saving={state.skills.saving}
        error={state.skills.error}
        ok={state.skills.ok}
        onSave={() => handleSave("skills", site.skills)}
      >
        <ListField
          label="Skill categories"
          items={site.skills}
          onAdd={() =>
            setSite({
              ...site,
              skills: [...site.skills, { category: "", items: [] }],
            })
          }
          onRemove={(i) =>
            setSite({
              ...site,
              skills: site.skills.filter((_, idx) => idx !== i),
            })
          }
          renderItem={(item, i) => (
            <SkillCategoryCard
              item={item}
              onChange={(updated) =>
                setSite({
                  ...site,
                  skills: site.skills.map((s, idx) =>
                    idx === i ? updated : s
                  ),
                })
              }
            />
          )}
          addLabel="Add category"
          emptyHint="No skill categories yet."
        />
      </Section>

      <Section
        title="Certifications"
        saving={state.certifications.saving}
        error={state.certifications.error}
        ok={state.certifications.ok}
        onSave={() => handleSave("certifications", site.certifications)}
      >
        <ListField
          label="Certifications"
          items={site.certifications}
          onAdd={() =>
            setSite({
              ...site,
              certifications: [
                ...site.certifications,
                { name: "", year: null, status: "in_view" },
              ],
            })
          }
          onRemove={(i) =>
            setSite({
              ...site,
              certifications: site.certifications.filter((_, idx) => idx !== i),
            })
          }
          renderItem={(item, i) => (
            <CertificationCard
              item={item}
              onChange={(updated) =>
                setSite({
                  ...site,
                  certifications: site.certifications.map((c, idx) =>
                    idx === i ? updated : c
                  ),
                })
              }
            />
          )}
          addLabel="Add certification"
          emptyHint="No certifications yet."
        />
      </Section>

      <Section
        title="Projects"
        saving={state.projects.saving}
        error={state.projects.error}
        ok={state.projects.ok}
        onSave={() => handleSave("projects", site.projects)}
      >
        <ListField
          label="Projects"
          items={site.projects}
          onAdd={() =>
            setSite({
              ...site,
              projects: [
                ...site.projects,
                { title: "", tech: "", impact: "", tags: [] },
              ],
            })
          }
          onRemove={(i) =>
            setSite({
              ...site,
              projects: site.projects.filter((_, idx) => idx !== i),
            })
          }
          renderItem={(item, i) => (
            <ProjectCard
              item={item}
              onChange={(updated) =>
                setSite({
                  ...site,
                  projects: site.projects.map((p, idx) =>
                    idx === i ? updated : p
                  ),
                })
              }
            />
          )}
          addLabel="Add project"
          emptyHint="No projects yet."
        />
      </Section>

      <Section
        title="Interests"
        saving={state.interests.saving}
        error={state.interests.error}
        ok={state.interests.ok}
        onSave={() => handleSave("interests", site.interests)}
      >
        <TagInput
          label="Interests"
          name="interests"
          value={site.interests}
          onChange={(v) => setSite({ ...site, interests: v })}
          placeholder="press enter or comma"
        />
      </Section>

      <Section
        title="Languages"
        saving={state.languages.saving}
        error={state.languages.error}
        ok={state.languages.ok}
        onSave={() => handleSave("languages", site.languages)}
      >
        <TagInput
          label="Languages"
          name="languages"
          value={site.languages}
          onChange={(v) => setSite({ ...site, languages: v })}
          placeholder="press enter or comma"
        />
      </Section>

      <Section
        title="Referees"
        saving={state.referees.saving}
        error={state.referees.error}
        ok={state.referees.ok}
        onSave={() => handleSave("referees", site.referees)}
      >
        <ListField
          label="Referees"
          items={site.referees}
          onAdd={() =>
            setSite({
              ...site,
              referees: [...site.referees, { name: "", org: "", phone: "" }],
            })
          }
          onRemove={(i) =>
            setSite({
              ...site,
              referees: site.referees.filter((_, idx) => idx !== i),
            })
          }
          renderItem={(item, i) => (
            <RefereeCard
              item={item}
              onChange={(updated) =>
                setSite({
                  ...site,
                  referees: site.referees.map((r, idx) =>
                    idx === i ? updated : r
                  ),
                })
              }
            />
          )}
          addLabel="Add referee"
          emptyHint="No referees yet."
        />
      </Section>

      <Section
        title="Social links"
        description="Shown as a row of icons in the header. Add a label override to customize the accessible name."
        saving={state.social.saving}
        error={state.social.error}
        ok={state.social.ok}
        onSave={() => handleSave("social", site.social)}
      >
        <ListField
          label="Social links"
          items={site.social}
          onAdd={() =>
            setSite({
              ...site,
              social: [...site.social, { platform: "linkedin", url: "" }],
            })
          }
          onRemove={(i) =>
            setSite({
              ...site,
              social: site.social.filter((_, idx) => idx !== i),
            })
          }
          renderItem={(item, i) => (
            <SocialCard
              item={item}
              onChange={(updated) =>
                setSite({
                  ...site,
                  social: site.social.map((s, idx) =>
                    idx === i ? updated : s
                  ),
                })
              }
            />
          )}
          addLabel="Add social link"
          emptyHint="No social links yet. Add LinkedIn, GitHub, email, etc."
        />
      </Section>
    </div>
  );
}
