import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/auth/:path*", destination: "http://localhost:8080/auth/:path*" },
      { source: "/members/:path*", destination: "http://localhost:8080/members/:path*" },
      { source: "/user-profiles/:path*", destination: "http://localhost:8080/user-profiles/:path*" },
      { source: "/users/:path*", destination: "http://localhost:8080/users/:path*" },
      { source: "/teams/:path*", destination: "http://localhost:8080/teams/:path*" },
    ];
  },
};

export default nextConfig;
