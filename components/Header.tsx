"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { profile } from "@/lib/content";
import {
  SocialIcon,
  socialLabel,
} from "@/components/social-icons";

function BrandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-label="Brand icon"
      role="img"
    >
      <path
        d="M32 4 L56 16 L56 36 C56 48 45 56 32 60 C19 56 8 48 8 36 L8 16 Z"
        fill="none"
        stroke="#10b981"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <g fill="#10b981">
        <rect x="20" y="18" width="4" height="28" rx="1.5" />
        <path d="M20 18 H36 V22 H20 Z" />
        <path d="M20 30 H32 V34 H20 Z" />
        <path d="M20 42 H38 C40 42 40 46 38 46 H20 Z" />
        <rect x="40" y="28" width="3.5" height="18" rx="1.5" />
        <circle cx="41.75" cy="22" r="3" />
      </g>
      <g stroke="#10b981" strokeWidth="2.4" strokeLinecap="round">
        <line x1="14" y1="52" x2="54" y2="14" />
      </g>
      <g fill="#10b981">
        <circle cx="14" cy="52" r="3.4" />
        <circle cx="24" cy="44" r="2.6" />
        <circle cx="38" cy="28" r="3.2" />
        <circle cx="46" cy="20" r="2.4" />
        <circle cx="54" cy="14" r="3.4" />
      </g>
    </svg>
  );
}

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard Next.js SSR hydration pattern
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const showAvatar = profile.avatar && !avatarError;

  return (
    <header className="no-print border-b border-slate-200 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-md ring-1 ring-emerald-500/20">
            {showAvatar ? (
              <Image
                src={profile.avatar}
                alt={`${profile.name} – headshot`}
                fill
                sizes="56px"
                priority
                quality={85}
                className="object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center p-2">
                <BrandIcon className="h-full w-full" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              {profile.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {profile.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile.social.length > 0 && (
            <div className="hidden items-center gap-1 md:flex">
              {profile.social.map((s, i) => {
                const isMail = s.platform === "email";
                return (
                  <a
                    key={`${s.platform}-${i}`}
                    href={s.url}
                    target={isMail ? undefined : "_blank"}
                    rel={isMail ? undefined : "noopener noreferrer"}
                    aria-label={socialLabel(s.platform, s.label)}
                    title={socialLabel(s.platform, s.label)}
                    className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                  >
                    <SocialIcon
                      platform={s.platform}
                      className="h-4 w-4"
                    />
                  </a>
                );
              })}
            </div>
          )}
          <a
            href={`mailto:${profile.email}`}
            className="hidden rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:inline-flex"
          >
            Contact
          </a>
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-md border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
