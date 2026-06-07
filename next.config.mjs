/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Modern formats served automatically based on Accept header
    formats: ["image/avif", "image/webp"],
    // Allowed quality values for next/image (Next.js 16 defaults to [75])
    qualities: [60, 75, 85, 90],
    // Cache optimized images aggressively (1 year)
    minimumCacheTTL: 31536000,
    // Restrict remote image sources to known, safe hosts
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    // Allow next/image to optimize local SVGs only via dangerouslyAllowSVG=false
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
