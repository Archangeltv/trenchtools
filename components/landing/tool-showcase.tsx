"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Terminal,
  Zap,
} from "lucide-react";

import { type ToolCategory, type ToolMeta, tools } from "@/lib/tools";
import { robinhoodChain } from "@/lib/chain";

type Filter = "all" | ToolCategory;

const filterTabs: { id: Filter; label: string; count: number }[] = [
  { id: "all", label: "all tools", count: tools.length },
  {
    id: "transact",
    label: "transact & deploy",
    count: tools.filter((t) => t.category === "transact").length,
  },
  {
    id: "read",
    label: "read & analytics",
    count: tools.filter((t) => t.category === "read").length,
  },
  {
    id: "offline",
    label: "offline & cryptography",
    count: tools.filter((t) => t.category === "offline").length,
  },
];

function InteractivePlayground() {
  const [activeTab, setActiveTab] = useState<"converter" | "checksum" | "gas">(
    "converter",
  );
  const [ethAmount, setEthAmount] = useState("0.05");
  const [addressInput, setAddressInput] = useState(
    "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  );
  const [copied, setCopied] = useState<string | null>(null);

  const parsedEth = parseFloat(ethAmount) || 0;
  const gweiValue = (parsedEth * 1e9).toLocaleString();
  const weiValue = (parsedEth * 1e18).toLocaleString("fullwide", {
    useGrouping: false,
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="relative mb-14 overflow-hidden rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_#000000] dark:bg-neutral-900 dark:border-white/40 dark:shadow-[8px_8px_0px_#ccff00]">
      {/* Top Banner Bar */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#ccff00] text-black border-2 border-black font-mono text-[11px] font-black uppercase">
            <Terminal className="size-3" />
            <span>quick playground console</span>
          </div>
          <h3 className="mt-2 font-heading text-2xl font-black lowercase tracking-tight text-black dark:text-white sm:text-3xl">
            test math & stats in-browser
          </h3>
          <p className="mt-1 font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            instant unit conversions, address checksums, and live robinhood chain parameters.
          </p>
        </div>

        {/* Tab Switch Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("converter")}
            className={`rounded-xl px-4 py-1.5 font-mono text-xs font-black uppercase border-2 border-black transition-all ${
              activeTab === "converter"
                ? "bg-[#ccff00] text-black shadow-[3px_3px_0px_#000000] -translate-y-0.5"
                : "bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white"
            }`}
          >
            unit converter
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("checksum")}
            className={`rounded-xl px-4 py-1.5 font-mono text-xs font-black uppercase border-2 border-black transition-all ${
              activeTab === "checksum"
                ? "bg-[#ccff00] text-black shadow-[3px_3px_0px_#000000] -translate-y-0.5"
                : "bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white"
            }`}
          >
            address check
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("gas")}
            className={`rounded-xl px-4 py-1.5 font-mono text-xs font-black uppercase border-2 border-black transition-all ${
              activeTab === "gas"
                ? "bg-[#ccff00] text-black shadow-[3px_3px_0px_#000000] -translate-y-0.5"
                : "bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white"
            }`}
          >
            live chain specs
          </button>
        </div>
      </div>

      {/* Active Tab View */}
      <div className="mt-6 rounded-2xl border-3 border-black bg-neutral-100 p-5 dark:border-white/30 dark:bg-neutral-950">
        {activeTab === "converter" && (
          <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-3">
            <div>
              <label className="font-mono text-xs font-black uppercase text-neutral-700 dark:text-neutral-300">
                amount in eth
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border-2 border-black bg-white px-3 py-2 shadow-[3px_3px_0px_#000000] dark:bg-neutral-900">
                <input
                  type="text"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                  className="w-full bg-transparent font-mono text-sm font-bold text-neutral-900 outline-none dark:text-white"
                  placeholder="0.05"
                />
                <span className="font-mono text-xs font-black text-black dark:text-[#ccff00]">
                  ETH
                </span>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs font-black uppercase text-neutral-700 dark:text-neutral-300">
                gwei (gas units)
              </label>
              <div className="mt-1.5 flex items-center justify-between rounded-xl border-2 border-black bg-white px-3 py-2 shadow-[3px_3px_0px_#000000] dark:bg-neutral-900">
                <span className="font-mono text-sm font-black text-[#7000ff] dark:text-[#ccff00] truncate">
                  {gweiValue}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(gweiValue, "gwei")}
                  className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                  title="Copy Gwei"
                >
                  {copied === "gwei" ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4 text-black dark:text-white" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs font-black uppercase text-neutral-700 dark:text-neutral-300">
                wei (raw evm units)
              </label>
              <div className="mt-1.5 flex items-center justify-between rounded-xl border-2 border-black bg-white px-3 py-2 shadow-[3px_3px_0px_#000000] dark:bg-neutral-900">
                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate pr-2">
                  {weiValue}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(weiValue, "wei")}
                  className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded transition-colors"
                  title="Copy Wei"
                >
                  {copied === "wei" ? (
                    <Check className="size-4 text-green-600" />
                  ) : (
                    <Copy className="size-4 text-black dark:text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "checksum" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label className="font-mono text-xs font-black uppercase text-neutral-700 dark:text-neutral-300">
                raw address input
              </label>
              <input
                type="text"
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="mt-1.5 w-full rounded-xl border-2 border-black bg-white px-3 py-2 font-mono text-xs text-neutral-900 outline-none shadow-[3px_3px_0px_#000000] dark:bg-neutral-900 dark:text-white"
              />
            </div>
            <div className="sm:self-end">
              <Link
                href="/tools/address-utils"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-black px-4 font-mono text-xs font-black uppercase text-[#ccff00] border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#7000ff] hover:text-white transition-all"
              >
                <span>launch address suite</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === "gas" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_#000000] dark:bg-neutral-900">
              <div className="font-mono text-[10px] font-bold uppercase text-neutral-500">
                chain id
              </div>
              <div className="mt-1 font-mono text-base font-black text-black dark:text-[#ccff00]">
                {robinhoodChain.id}
              </div>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_#000000] dark:bg-neutral-900">
              <div className="font-mono text-[10px] font-bold uppercase text-neutral-500">
                network
              </div>
              <div className="mt-1 font-mono text-base font-black text-[#7000ff] dark:text-[#ff0099]">
                Robinhood Chain
              </div>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_#000000] dark:bg-neutral-900">
              <div className="font-mono text-[10px] font-bold uppercase text-neutral-500">
                typical gas
              </div>
              <div className="mt-1 font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                ~0.001 Gwei
              </div>
            </div>
            <div className="rounded-xl border-2 border-black bg-white p-3 shadow-[3px_3px_0px_#000000] dark:bg-neutral-900">
              <div className="font-mono text-[10px] font-bold uppercase text-neutral-500">
                execution
              </div>
              <div className="mt-1 font-mono text-base font-black text-black dark:text-white">
                100% Client-Side
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ModernToolCard({ tool }: { tool: ToolMeta }) {
  const Icon = tool.icon;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-3 border-black bg-white p-6 shadow-[5px_5px_0px_#000000] dark:bg-neutral-900 dark:border-white/30 dark:shadow-[5px_5px_0px_#ffffff] transition-all duration-200 hover:-translate-y-1 hover:translate-x-0.5 active:translate-x-1 active:translate-y-1"
    >
      <div>
        {/* Header Icon & Badges */}
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

        {/* Content */}
        <div className="mt-5 space-y-1.5">
          <h3 className="font-heading text-xl font-black lowercase tracking-tight text-black dark:text-white group-hover:text-[#7000ff] dark:group-hover:text-[#ccff00] transition-colors">
            {tool.name}
          </h3>
          <p className="font-sans text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            {tool.tagline}
          </p>
        </div>
      </div>

      {/* Footer Action */}
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
}

export function ToolShowcase() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleTools =
    filter === "all" ? tools : tools.filter((tool) => tool.category === filter);

  return (
    <section className="relative py-20 sm:py-28 bg-[#fafafa] dark:bg-[#0c0c0c] border-t-4 border-black dark:border-white/20">
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-block px-3.5 py-1 text-xs font-mono font-black uppercase tracking-wider bg-[#7000ff] text-white border-2 border-black shadow-[3px_3px_0px_#000] rotate-[-1deg]">
              the entire toolkit
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-5xl font-black lowercase tracking-tight text-black dark:text-white">
              all the tools you{" "}
              <span className="underline decoration-[#ccff00] decoration-wavy decoration-3">
                actually need.
              </span>
            </h2>
            <p className="mt-3 font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
              zero bloat, zero fake numbers. pure high-velocity utilities
              engineered for robinhood chain traders and builders.
            </p>
          </div>

          <Link
            href="/tools"
            className="inline-flex h-12 items-center gap-2 rounded-2xl border-3 border-black bg-black px-6 font-heading text-sm font-black lowercase text-[#ccff00] shadow-[5px_5px_0px_#000000] hover:bg-[#7000ff] hover:text-white transition-all active:translate-x-1 active:translate-y-1"
          >
            <span>launch all 14 tools</span>
            <ArrowUpRight className="size-4" strokeWidth={3} />
          </Link>
        </div>

        {/* Interactive Live Playground Console */}
        <div className="mt-12">
          <InteractivePlayground />
        </div>

        {/* Filter Pills Navigation */}
        <div className="mb-8 flex flex-wrap items-center gap-2.5">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-black uppercase border-2 border-black transition-all ${
                filter === tab.id
                  ? "bg-[#ccff00] text-black shadow-[4px_4px_0px_#000000] -translate-y-0.5"
                  : "bg-white text-neutral-700 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-300 shadow-[2px_2px_0px_#000000]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                  filter === tab.id
                    ? "bg-black text-[#ccff00]"
                    : "bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <ModernToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
