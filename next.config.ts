import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Prevent the site from being embedded in an iframe on another
          // domain (clickjacking protection).
          { key: "X-Frame-Options", value: "DENY" },
          // Prevent browsers from guessing content types (MIME sniffing).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Limit how much referrer info is sent when navigating away.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Force HTTPS for a full year, including subdomains.
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Disable browser features this app doesn't use, reducing attack surface.
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
