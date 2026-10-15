"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { type ToolCategory, tools } from "@/lib/tools";

type Filter = ToolCategory | "all";

const filters: { value: Filter; label: string; count: number }[] = [
  { value: "all", label: "all activities", count: tools.length },
  {
    value: "transact",
    label: "transact & deploy",
    count: tools.filter((t) => t.category === "transact").length,
  },
  {
    value: "read",
    label: "read & analytics",
    count: tools.filter((t) => t.category === "read").length,
  },
  {
    value: "offline",
    label: "offline & cryptography",
    count: tools.filter((t) => t.category === "offline").length,
  },
];

export function ToolsGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible =
    filter === "all" ? tools : tools.filter((tool) => tool.category === filter);

  return (
    <div className="space-y-8">
      {/* Brutalist Filter Pills */}
      <div className="flex flex-wrap items-center gap-2.5">
        {filters.map((entry) => (
          <button
            key={entry.value}
            type="button"
            onClick={() => setFilter(entry.value)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-black uppercase border-2 border-black transition-all ${
              filter === entry.value
                ? "bg-[#ccff00] text-black shadow-[4px_4px_0px_#000000] -translate-y-0.5"
                : "bg-white text-neutral-800 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-200 shadow-[2px_2px_0px_#000000]"
            }`}
          >
            <span>{entry.label}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                filter === entry.value
                  ? "bg-black text-[#ccff00]"
                  : "bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white"
              }`}
            >
              {entry.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid of Neo-Brutalist Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-3 border-black bg-white p-6 shadow-[5px_5px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[5px_5px_0px_#ccff00] transition-all duration-200 hover:-translate-y-1 hover:translate-x-0.5 active:translate-x-1 active:translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl border-2 border-black bg-[#ccff00] text-black shadow-[2px_2px_0px_#000000] transition-transform duration-200 group-hover:scale-110">
                    <Icon className="size-6" strokeWidth={2.5} />
                  </span>

                  <div className="flex items-center gap-1.5">
                    {tool.requiresWallet ? (
                      <span className="px-2.5 py-0.5 font-mono text-[11px] font-black uppercase rounded-full border-2 border-black bg-[#ff0099] text-white">
                        wallet
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 font-mono text-[11px] font-black uppercase rounded-full border-2 border-black bg-[#ccff00] text-black">
                        100% offline
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 space-y-1.5">
                  <h3 className="font-heading text-xl font-black lowercase tracking-tight text-neutral-950 dark:text-white group-hover:text-[#7000ff] dark:group-hover:text-[#ccff00] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="font-sans text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {tool.tagline}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-6 flex items-center justify-between border-t-2 border-black/10 dark:border-white/10 pt-4">
                <span className="font-mono text-xs font-bold uppercase text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                  open tool ↗
                </span>
                <span className="flex size-8 items-center justify-center rounded-full border-2 border-black bg-black text-[#ccff00] transition-transform group-hover:rotate-45">
                  <ArrowRight className="size-4" strokeWidth={3} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
