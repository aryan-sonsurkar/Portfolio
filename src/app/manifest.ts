import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aryan Sonsurkar — MODCODES District",
    short_name: "MODCODES",
    description:
      "Interactive 3D portfolio: 16-building district, real projects, proof of work.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0612",
    theme_color: "#0a0612",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
