"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Flame,
  Send,
  ShieldAlert,
  Sparkles,
  Terminal,
} from "lucide-react";

export function BentoGrid() {
  return (
    <section className="relative py-12 sm:py-20 bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#ff0099] px-3.5 py-1 text-xs font-black uppercase text-white shadow-[3px_3px_0px_#000000]">
              <Sparkles className="size-3.5 fill-current" />
              <span>THE POWER TOOLKIT</span>
            </div>
            <h2 className="mt-3 font-heading text-3xl sm:text-5xl font-black tracking-tight text-neutral-950 dark:text-white lowercase">
              built for speed. zero fluff.
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-normal text-neutral-600 dark:text-neutral-400">
            every tool executes client-side with direct RPC requests. no custodial middleman, no databases, and no hidden markups.
          </p>
        </div>

        {/* 12-Column Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Card A: 7 Columns - Batch Multisender */}
          <div className="md:col-span-7 relative overflow-hidden rounded-3xl border-4 border-black bg-[#f8f8f4] dark:bg-neutral-900 p-6 sm:p-8 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full border-2 border-black bg-[#ccff00] px-3 py-1 font-heading text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000]">
                  BATCH DISPENSER
                </span>
                <span className="font-mono text-xs font-bold text-neutral-500">
                  TOOL #01
                </span>
              </div>
              <h3 className="mt-4 font-heading text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white lowercase">
                send to hundreds of wallets in one click
              </h3>
              <p className="mt-2.5 max-w-lg text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                Distribute native ETH or any ERC-20 to up to 500 recipients per batch.
                Automated chunking at 200–300 per tx with verified helper contracts and zero custodial pooling.
              </p>

              {/* Quick Feature Badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border border-black bg-white dark:bg-black px-2.5 py-1 font-mono text-xs font-bold">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Auto Gas Estimation
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-black bg-white dark:bg-black px-2.5 py-1 font-mono text-xs font-bold">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  CSV / Paste Import
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-black bg-white dark:bg-black px-2.5 py-1 font-mono text-xs font-bold">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Failed-Chunk Retry
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t-2 border-black/10 dark:border-white/10">
              <Link
                href="/tools/multisender"
                className="brutal-btn inline-flex items-center gap-2 rounded-xl bg-[#ccff00] px-5 py-2.5 text-xs sm:text-sm font-black text-black active:translate-x-1 active:translate-y-1"
              >
                <span>open multisender</span>
                <ArrowUpRight className="size-4 stroke-[3]" />
              </Link>
              <Send className="size-16 sm:size-20 text-neutral-300/60 dark:text-neutral-800 pointer-events-none -mb-3 -mr-3" />
            </div>
          </div>

          {/* Card B: 5 Columns - Instant Token Creator */}
          <div className="md:col-span-5 relative overflow-hidden rounded-3xl border-4 border-black bg-[#0a0a0a] p-6 sm:p-8 shadow-[6px_6px_0px_#000000] text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full border-2 border-black bg-[#ff0099] px-3 py-1 font-heading text-xs font-black uppercase text-white shadow-[2px_2px_0px_#ffffff]">
                  TOKEN DEPLOYER
                </span>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  TOOL #02
                </span>
              </div>
              <h3 className="mt-4 font-heading text-2xl sm:text-3xl font-black tracking-tight text-white lowercase">
                deploy verified erc-20s in 1 transaction
              </h3>
              <p className="mt-2.5 text-sm sm:text-base text-neutral-300">
                Launch production-ready tokens on Robinhood Chain. Standard OpenZeppelin implementation,
                custom decimals, optional burn/mint, verified bytecode on Blockscout.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t-2 border-neutral-800">
              <Link
                href="/tools/token-creator"
                className="brutal-btn inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-black text-black active:translate-x-1 active:translate-y-1"
              >
                <span>deploy token</span>
                <ArrowUpRight className="size-4 stroke-[3]" />
              </Link>
              <Flame className="size-16 sm:size-20 text-[#ff0099]/40 pointer-events-none -mb-3 -mr-3" />
            </div>
          </div>

          {/* Card C: 4 Columns - Approval Revoker */}
          <div className="md:col-span-4 rounded-3xl border-4 border-black bg-white dark:bg-neutral-900 p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-xl border-2 border-black bg-[#ff0099] flex items-center justify-center text-white shadow-[3px_3px_0px_#000000]">
                <ShieldAlert className="size-5 stroke-[2.5]" />
              </div>
              <h4 className="mt-4 font-heading text-xl font-black text-neutral-950 dark:text-white lowercase">
                approval manager
              </h4>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Audit every allowance granted by your wallet. Flag unlimited approvals and revoke rogue spenders with a single transaction.
              </p>
            </div>
            <Link
              href="/tools/approvals"
              className="mt-6 font-heading text-xs font-extrabold uppercase tracking-wide text-neutral-950 dark:text-[#ccff00] hover:underline inline-flex items-center gap-1"
            >
              <span>scan allowances ↗</span>
            </Link>
          </div>

          {/* Card D: 4 Columns - Offline Cryptography */}
          <div className="md:col-span-4 rounded-3xl border-4 border-black bg-white dark:bg-neutral-900 p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-xl border-2 border-black bg-[#ccff00] flex items-center justify-center text-black shadow-[3px_3px_0px_#000000]">
                <Cpu className="size-5 stroke-[2.5]" />
              </div>
              <h4 className="mt-4 font-heading text-xl font-black text-neutral-950 dark:text-white lowercase">
                100% offline tools
              </h4>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Vanity address grinding, merkle tree proof generation, and keccak256 hashing run completely inside local Web Workers. Zero leaks.
              </p>
            </div>
            <Link
              href="/tools/vanity"
              className="mt-6 font-heading text-xs font-extrabold uppercase tracking-wide text-neutral-950 dark:text-[#ccff00] hover:underline inline-flex items-center gap-1"
            >
              <span>grind vanity key ↗</span>
            </Link>
          </div>

          {/* Card E: 4 Columns - Calldata Decoder & Radar */}
          <div className="md:col-span-4 rounded-3xl border-4 border-black bg-white dark:bg-neutral-900 p-6 shadow-[6px_6px_0px_#000000] flex flex-col justify-between">
            <div>
              <div className="size-10 rounded-xl border-2 border-black bg-[#7000ff] flex items-center justify-center text-white shadow-[3px_3px_0px_#000000]">
                <Terminal className="size-5 stroke-[2.5]" />
              </div>
              <h4 className="mt-4 font-heading text-xl font-black text-neutral-950 dark:text-white lowercase">
                transaction decoder
              </h4>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                Decompile raw transaction calldata into human-readable actions and function parameters against verified Blockscout ABIs.
              </p>
            </div>
            <Link
              href="/tools/decoder"
              className="mt-6 font-heading text-xs font-extrabold uppercase tracking-wide text-neutral-950 dark:text-[#ccff00] hover:underline inline-flex items-center gap-1"
            >
              <span>decode calldata ↗</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
