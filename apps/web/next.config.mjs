const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  (process.env.STRIPE_PUBLISHABLE_KEY?.startsWith("pk_") ? process.env.STRIPE_PUBLISHABLE_KEY : "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@speedy-van/shared", "@speedy-van/config"],
  env: stripePublishableKey
    ? { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: stripePublishableKey }
    : {},
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
      {
        pathname: "/logo.png",
        search: "?v=amber-20260921-1",
      },
    ],
    qualities: [60, 70, 75],
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
      {
        source: "/areas/glasgow/business-removals",
        destination: "/areas/glasgow/office-removal",
        permanent: true,
      },
      {
        source: "/areas/glasgow/storage-transport",
        destination: "/storage/enquiry?source=glasgow_storage_transport",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
