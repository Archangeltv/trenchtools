import type { Metadata } from "next";
import { Terminal } from "lucide-react";

import { ToolsGrid } from "@/components/tools-grid";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Tools Directory",
  description:
    "A privacy-first toolkit for Robinhood Chain. Every tool runs in your browser and talks directly to the public RPC.",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="relative min-h-[85vh] py-12 sm:py-20 bg-background">
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ccff00] text-black border-2 border-black font-mono text-xs font-black uppercase shadow-[3px_3px_0px_#000000]">
            <Terminal className="size-3.5" />
            <span>14 client-side web3 utilities</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-6xl font-black lowercase tracking-tight text-neutral-950 dark:text-white">
            the robinhood chain{" "}
            <span className="underline decoration-[#7000ff] decoration-wavy decoration-3">
              toolkit
            </span>
          </h1>
          <p className="font-sans text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            batch multisends, verified erc-20 token deployments, allowance auditors, and offline cryptographic utilities — all operating 100% inside your browser sandbox.
          </p>
        </header>

        <div className="mt-12">
          <ToolsGrid />
        </div>
      </div>
    </div>
  );
}
