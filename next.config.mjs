/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "umlwdospvvdauxzulbnu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/products/**",
      },
      {
        protocol: "https",
        hostname: "umlwdospvvdauxzulbnu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/categories/**",
      },
    ],
  },
};

export default nextConfig;
