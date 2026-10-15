import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "trench.tools: on-chain toolkit for Robinhood Chain",
    short_name: "trench.tools",
    description:
      "Degen on-chain tools for Robinhood Chain. Transactions are built in your browser and signed by your wallet, with no server in between.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#EC4899",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
