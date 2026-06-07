export type CertificationStatus = "earned" | "in_view";

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "twitter"
  | "youtube"
  | "instagram"
  | "facebook"
  | "mastodon"
  | "bluesky"
  | "email"
  | "website";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface Experience {
  role: string;
  company: string;
  years: string;
  yearStart: number;
  yearEnd: number;
  highlights: string[];
  tags: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: number;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Certification {
  name: string;
  year: number | null;
  status: CertificationStatus;
}

export interface Project {
  title: string;
  tech: string;
  impact: string;
  tags: string[];
}

export interface Referee {
  name: string;
  org: string;
  phone: string;
}

export interface SiteData {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  summary: string;

  experience: Experience[];
  education: Education[];
  educationNote: string;

  skills: SkillCategory[];

  certifications: Certification[];
  projects: Project[];

  interests: string[];
  languages: string[];
  referees: Referee[];

  social: SocialLink[];
}
