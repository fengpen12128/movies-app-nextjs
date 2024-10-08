import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.1.37",
      },
      {
        protocol: "http",
        hostname: "192.168.1.12",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(process.cwd()),
    };
    return config;
  },
};

export default nextConfig;
