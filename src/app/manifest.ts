import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KaamProof — Verified Work Record",
    short_name: "KaamProof",
    description: "Worker-owned work sessions, wage records and verifiable certificates.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F7F7F2",
    theme_color: "#174D3A",
    lang: "hi",
    icons: [
      { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
