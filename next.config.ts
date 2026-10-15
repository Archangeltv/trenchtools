import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't infer a parent directory that
  // happens to contain another lockfile.
  turbopack: {
    root: path.resolve(),
  },
};

// Wrap with fumadocs-mdx so `content/docs/**` MDX is compiled and the `.source`
// runtime is generated. `createMDX()` reads `source.config.ts` by default.
const withMDX = createMDX();

export default withMDX(nextConfig);
