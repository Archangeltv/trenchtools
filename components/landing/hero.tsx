"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Layers,
  Radio,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-4 pb-12 sm:pt-8 sm:pb-16">
      {/* Decorative Neo-Brutalist Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-grid-tech dark:hidden opacity-30" />

      {/* Background Decorative Blur Orbs */}
      <div className="pointer-events-none absolute -top-20 -left-10 size-72 rounded-full bg-[#ccff00]/10 blur-3xl" />
      <div className="pointer-events-none absolute top-40 right-0 size-80 rounded-full bg-[#7000ff]/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Bold Neo-Brutalist Headlines and Honest Stats */}
          <div className="lg:col-span-7">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#ccff00] px-4 py-1.5 text-xs font-black tracking-wide text-black shadow-[3px_3px_0px_#000000]">
              <span className="size-2 rounded-full bg-black animate-pulse" />
              <span>ROBINHOOD CHAIN MAINNET · CHAIN 4663</span>
            </div>

            {/* Massive Headline in Space Grotesk */}
            <h1 className="mt-5 font-heading text-4xl sm:text-6xl lg:text-[4.4rem] font-black tracking-tight text-neutral-950 dark:text-white leading-[1.03] lowercase">
              tools for your everyday activities in the{" "}
              <span className="bg-gradient-to-r from-[#7000ff] via-[#ff0099] to-[#ff0099] bg-clip-text text-transparent underline decoration-black decoration-wavy decoration-3 dark:decoration-white">
                trenches*
              </span>
            </h1>

            {/* Honest, Direct Subtext (Zero Lies) */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed font-normal text-neutral-700 dark:text-neutral-300">
              send to 500 wallets in one transaction. deploy verified erc-20s in seconds.
              audit and revoke suspicious approvals. 100% client-side in your browser
              with zero custody, zero tracking, and zero platform tax.
            </p>

            {/* Dual Brutalist CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/tools"
                className="brutal-btn inline-flex items-center gap-2 rounded-xl bg-[#ccff00] px-6 py-3.5 text-sm sm:text-base font-extrabold text-black active:translate-x-1 active:translate-y-1"
              >
                <span>launch toolkit</span>
                <ArrowUpRight className="size-4 stroke-[3]" />
              </Link>
              <Link
                href="/docs"
                className="brutal-btn inline-flex items-center gap-2 rounded-xl bg-white dark:bg-neutral-900 px-6 py-3.5 text-sm sm:text-base font-bold text-neutral-950 dark:text-white active:translate-x-1 active:translate-y-1"
              >
                <span>explore docs</span>
              </Link>
            </div>

            {/* 100% Honest Metric Badges (Zero Fake User Claims) */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t-2 border-black/10 dark:border-white/10">
              <div className="rounded-xl border-2 border-black bg-white dark:bg-neutral-900 p-3 shadow-[3px_3px_0px_#000000]">
                <div className="font-heading text-2xl font-black text-[#7000ff] dark:text-[#ccff00]">100%</div>
                <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">client-side</div>
              </div>
              <div className="rounded-xl border-2 border-black bg-white dark:bg-neutral-900 p-3 shadow-[3px_3px_0px_#000000]">
                <div className="font-heading text-2xl font-black text-[#ff0099]">0%</div>
                <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">app tax</div>
              </div>
              <div className="rounded-xl border-2 border-black bg-white dark:bg-neutral-900 p-3 shadow-[3px_3px_0px_#000000]">
                <div className="font-heading text-2xl font-black text-neutral-950 dark:text-white">0</div>
                <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">custodial risk</div>
              </div>
              <div className="rounded-xl border-2 border-black bg-white dark:bg-neutral-900 p-3 shadow-[3px_3px_0px_#000000]">
                <div className="font-heading text-2xl font-black text-[#00c805]">4663</div>
                <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">mainnet rpc</div>
              </div>
            </div>
          </div>

          {/* Right Column: Brutalist Interactive Frame with Floating Stickers */}
          <div className="relative lg:col-span-5 flex justify-center">
            {/* Floating Sticker 1: 0% App Tax */}
            <div className="animate-brutal-float absolute -top-4 -right-2 z-20 hidden sm:flex items-center gap-1.5 rounded-full border-2 border-black bg-[#ff0099] px-3.5 py-1.5 text-xs font-black uppercase text-white shadow-[4px_4px_0px_#000000]">
              <Zap className="size-3.5 fill-current" />
              <span>0% APP TAX</span>
            </div>

            {/* Floating Sticker 2: Zero Custody */}
            <div className="animate-brutal-float-alt absolute -bottom-5 -left-4 z-20 hidden sm:flex items-center gap-1.5 rounded-full border-2 border-black bg-[#ccff00] px-3.5 py-1.5 text-xs font-black uppercase text-black shadow-[4px_4px_0px_#000000]">
              <ShieldCheck className="size-3.5 stroke-[3]" />
              <span>ZERO CUSTODY</span>
            </div>

            {/* Floating Sticker 3: Arbitrum Orbit L2 */}
            <div className="animate-brutal-float absolute top-1/2 -right-6 z-20 hidden sm:flex items-center gap-1.5 rounded-full border-2 border-black bg-[#7000ff] px-3 py-1 text-[11px] font-black uppercase text-white shadow-[4px_4px_0px_#000000]">
              <Flame className="size-3 fill-current text-[#ccff00]" />
              <span>ORBIT L2</span>
            </div>

            {/* Brutalist Device Mockup */}
            <div className="w-full max-w-md rotate-1 hover:rotate-0 transition-transform duration-300 rounded-[2.2rem] border-4 border-black bg-[#0a0a0a] p-5 shadow-[8px_8px_0px_#000000] text-white">
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-[#ff0099]" />
                  <div className="size-3 rounded-full bg-[#ccff00]" />
                  <div className="size-3 rounded-full bg-[#7000ff]" />
                </div>
                <div className="font-mono text-xs text-neutral-400 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#ccff00] animate-ping" />
                  <span>RPC: LIVE</span>
                </div>
              </div>

              {/* Mockup Card 1: Multisender Active State */}
              <div className="mt-4 rounded-xl border-2 border-black bg-neutral-900 p-4 shadow-[4px_4px_0px_#ccff00]">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-black uppercase tracking-wider text-[#ccff00]">
                    BATCH MULTISENDER
                  </span>
                  <span className="rounded bg-black px-2 py-0.5 font-mono text-[10px] text-white">
                    READY
                  </span>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                  <div>
                    <div className="font-heading text-2xl font-black">200 Wallets</div>
                    <div className="text-xs text-neutral-400">1 single batch transaction</div>
                  </div>
                  <div className="rounded-lg border border-black bg-[#ccff00] px-2.5 py-1 font-mono text-xs font-black text-black">
                    0.0004 ETH
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full w-full bg-[#ccff00]" />
                  </div>
                  <span className="font-mono text-[10px] text-neutral-400">VALIDATED</span>
                </div>
              </div>

              {/* Mockup Card 2: Instant Token Creator */}
              <div className="mt-3.5 rounded-xl border-2 border-black bg-neutral-900 p-4 shadow-[4px_4px_0px_#ff0099]">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-black uppercase tracking-wider text-[#ff0099]">
                    TOKEN CREATOR
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400">VERIFIED ABI</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <span className="font-heading text-lg font-black">$TRENCH</span>
                    <span className="ml-2 font-mono text-xs text-neutral-400">1,000,000,000</span>
                  </div>
                  <div className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-0.5 font-mono text-[11px] text-neutral-300">
                    TAX: 0%
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Button */}
              <Link
                href="/tools/multisender"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#ccff00] py-3 font-heading text-sm font-black text-black shadow-[4px_4px_0px_#ffffff] transition-all hover:bg-lime-300 active:translate-x-0.5 active:translate-y-0.5"
              >
                <Send className="size-4 stroke-[3]" />
                <span>EXECUTE BATCH SEND ↗</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
