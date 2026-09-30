/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "ibb.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.html",
        destination: "/sitemap",
      },
    ];
  },
};

export default nextConfig;
