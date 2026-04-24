/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@speedy-van/db", "@speedy-van/shared", "@speedy-van/config"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default nextConfig;
