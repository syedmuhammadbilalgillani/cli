import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "backendbatd.clinstitute.co.uk",
        port: "",
      },
      {
        protocol: "https",
        hostname: "clinstitute.co.uk",
        port: "",
      },
      {
        protocol: "https",
        hostname: "batdacademy.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
