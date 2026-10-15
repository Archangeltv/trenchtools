import type { ReactNode } from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

import { type ToolCategory, getTool } from "@/lib/tools";

const categoryLabels: Record<ToolCategory, string> = {
  transact: "on-chain transaction",
  read: "read-only query",
  offline: "100% offline & private",
};

interface ToolPageProps {
  slug: string;
  steps?: unknown[];
  children: ReactNode;
}

export function ToolPage({ slug, children }: ToolPageProps) {
  const tool = getTool(slug);

  if (!tool) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        {children}
      </div>
    );
  }

  const Icon = tool.icon;

  return (
    <div className="relative min-h-screen py-10 sm:py-16 bg-background">
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        {/* Top Brutalist Badges */}
        <div className="mb-6 flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center rounded-xl border-2 border-black bg-[#ccff00] px-3.5 py-1 font-mono text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000000]">
            {categoryLabels[tool.category]}
          </span>

          {tool.requiresWallet ? (
            <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#ff0099] px-3.5 py-1 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#000000]">
              <ShieldCheck className="size-3.5" strokeWidth={3} />
              <span>wallet signer required</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#7000ff] px-3.5 py-1 font-mono text-xs font-black uppercase text-white shadow-[3px_3px_0px_#000000]">
              <CheckCircle2 className="size-3.5" strokeWidth={3} />
              <span>100% client-side offline</span>
            </span>
          )}

          <span className="inline-flex items-center rounded-xl border-2 border-black bg-white dark:bg-neutral-900 px-3 py-1 font-mono text-[11px] font-bold text-neutral-800 dark:text-neutral-200 shadow-[2px_2px_0px_#000000]">
            chain id: 4663
          </span>
        </div>

        {/* Tool Header */}
        <header className="max-w-3xl space-y-3">
          <div className="flex items-center gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl border-3 border-black bg-[#ccff00] text-black shadow-[4px_4px_0px_#000000]">
              <Icon className="size-7" strokeWidth={2.5} />
            </span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black lowercase tracking-tight text-neutral-950 dark:text-white">
              {tool.name}
            </h1>
          </div>
          <p className="font-sans text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            {tool.tagline}
          </p>
        </header>

        {/* Main Brutalist Workspace Card */}
        <div className="mt-8">
          <div className="rounded-3xl border-4 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[8px_8px_0px_#ccff00]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
