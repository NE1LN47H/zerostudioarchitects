import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/journal",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/journal/:path*",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/in-the-media",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/in-the-media/:path*",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/admin/journal",
        destination: "/admin/media",
        permanent: true,
      },
      {
        source: "/admin/hero",
        destination: "/admin/projects",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
