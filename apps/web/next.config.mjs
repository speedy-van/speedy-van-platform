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
};

export default nextConfig;
