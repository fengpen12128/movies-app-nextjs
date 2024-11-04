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
        hostname: "192.168.1.22",
      },
      {
        protocol: "http",
        hostname: "192.168.1.12",
      },
      {
        protocol: "http",
        hostname: "100.103.139.70",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
