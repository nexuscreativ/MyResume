"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import {
  readSite,
  writeSite,
  uploadImage as uploadImageToStorage,
} from "@/lib/database";
import type {
  Certification,
  Education,
  Experience,
  Project,
  Referee,
  SkillCategory,
  SiteData,
  SocialLink,
} from "@/types/site";

export async function saveSection(
  section:
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
    | "social",
  payload: unknown
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, error: "Not authenticated" };
    }

    const site = await readSite();
    const updated: SiteData = { ...site };

    switch (section) {
      case "profile": {
        if (
          !isRecord(payload) ||
          !isString(payload.name) ||
          !isString(payload.title) ||
          !isString(payload.location) ||
          !isString(payload.email) ||
          !isString(payload.phone) ||
          !isString(payload.summary)
        ) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.name = payload.name;
        updated.title = payload.title;
        updated.location = payload.location;
        updated.email = payload.email;
        updated.phone = payload.phone;
        updated.summary = payload.summary;
        break;
      }
      case "avatar": {
        if (!isRecord(payload) || !isString(payload.avatar)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.avatar = payload.avatar;
        break;
      }
      case "experience": {
        if (!isExperienceArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.experience = payload;
        break;
      }
      case "education": {
        if (!isEducationArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.education = payload;
        break;
      }
      case "educationNote": {
        if (!isRecord(payload) || !isString(payload.educationNote)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.educationNote = payload.educationNote;
        break;
      }
      case "skills": {
        if (!isSkillCategoryArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.skills = payload;
        break;
      }
      case "certifications": {
        if (!isCertificationArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.certifications = payload;
        break;
      }
      case "projects": {
        if (!isProjectArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.projects = payload;
        break;
      }
      case "interests": {
        if (!isStringArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.interests = payload;
        break;
      }
      case "languages": {
        if (!isStringArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.languages = payload;
        break;
      }
      case "referees": {
        if (!isRefereeArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.referees = payload;
        break;
      }
      case "social": {
        if (!isSocialLinkArray(payload)) {
          return { ok: false, error: "Invalid payload" };
        }
        updated.social = payload;
        break;
      }
    }

    await writeSite(updated, section);
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function uploadImage(
  formData: FormData
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { ok: false, error: "Not authenticated" };
    }

    const file = formData.get("file");
    const subdir = formData.get("subdir");

    if (!(file instanceof File)) {
      return { ok: false, error: "Missing file" };
    }
    if (subdir !== "avatars" && subdir !== "projects") {
      return { ok: false, error: "Invalid subdir" };
    }

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const result = await uploadImageToStorage(
      bytes,
      file.type,
      subdir,
      file.name
    );
    return { ok: true, url: result.url };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/admin/login" });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isExperience(value: unknown): value is Experience {
  return (
    isRecord(value) &&
    isString(value.role) &&
    isString(value.company) &&
    isString(value.years) &&
    isNumber(value.yearStart) &&
    isNumber(value.yearEnd) &&
    isStringArray(value.highlights) &&
    isStringArray(value.tags)
  );
}

function isExperienceArray(value: unknown): value is Experience[] {
  return Array.isArray(value) && value.every(isExperience);
}

function isEducation(value: unknown): value is Education {
  return (
    isRecord(value) &&
    isString(value.degree) &&
    isString(value.school) &&
    isNumber(value.year)
  );
}

function isEducationArray(value: unknown): value is Education[] {
  return Array.isArray(value) && value.every(isEducation);
}

function isSkillCategory(value: unknown): value is SkillCategory {
  return (
    isRecord(value) &&
    isString(value.category) &&
    isStringArray(value.items)
  );
}

function isSkillCategoryArray(value: unknown): value is SkillCategory[] {
  return Array.isArray(value) && value.every(isSkillCategory);
}

function isCertification(value: unknown): value is Certification {
  return (
    isRecord(value) &&
    isString(value.name) &&
    (value.year === null || isNumber(value.year)) &&
    (value.status === "earned" || value.status === "in_view")
  );
}

function isCertificationArray(value: unknown): value is Certification[] {
  return Array.isArray(value) && value.every(isCertification);
}

function isProject(value: unknown): value is Project {
  return (
    isRecord(value) &&
    isString(value.title) &&
    isString(value.tech) &&
    isString(value.impact) &&
    isStringArray(value.tags)
  );
}

function isProjectArray(value: unknown): value is Project[] {
  return Array.isArray(value) && value.every(isProject);
}

function isReferee(value: unknown): value is Referee {
  return (
    isRecord(value) &&
    isString(value.name) &&
    isString(value.org) &&
    isString(value.phone)
  );
}

function isRefereeArray(value: unknown): value is Referee[] {
  return Array.isArray(value) && value.every(isReferee);
}

const VALID_PLATFORMS = new Set([
  "linkedin",
  "github",
  "twitter",
  "youtube",
  "instagram",
  "facebook",
  "mastodon",
  "bluesky",
  "email",
  "website",
]);

function isSocialLink(value: unknown): value is SocialLink {
  if (!isRecord(value)) return false;
  if (typeof value.platform !== "string") return false;
  if (!VALID_PLATFORMS.has(value.platform)) return false;
  if (typeof value.url !== "string") return false;
  if (value.label !== undefined && typeof value.label !== "string") return false;
  return true;
}

function isSocialLinkArray(value: unknown): value is SocialLink[] {
  return Array.isArray(value) && value.every(isSocialLink);
}
