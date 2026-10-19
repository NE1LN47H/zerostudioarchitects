import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/journal",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/in-the-media",
        destination: "/media",
        permanent: true,
      },
      {
        source: "/admin/journal",
        destination: "/admin/media",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
