/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@speedy-van/shared", "@speedy-van/config"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/booking-luxury",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/booking",
        destination: "/book",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
