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
};

export default nextConfig;
