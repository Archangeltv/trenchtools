import Link from "next/link";
import { ArrowUpRight, BookOpen, Terminal } from "lucide-react";

export function BottomCta() {
  return (
    <section className="relative overflow-hidden bg-[#ff0099] py-20 sm:py-28 text-black border-t-8 border-black">
      {/* Decorative floating emoji stickers in background */}
      <div className="pointer-events-none absolute -top-8 left-8 text-7xl select-none opacity-20 sm:opacity-30 brutal-float">
        💣
      </div>
      <div
        className="pointer-events-none absolute bottom-6 right-10 text-8xl select-none opacity-20 sm:opacity-30 brutal-float"
        style={{ animationDelay: "2s" }}
      >
        🦄
      </div>
      <div
        className="pointer-events-none absolute top-1/2 left-4 text-6xl select-none opacity-20 sm:opacity-30 brutal-float"
        style={{ animationDelay: "3.5s" }}
      >
        ⚡
      </div>
      <div
        className="pointer-events-none absolute -bottom-6 left-1/3 text-7xl select-none opacity-20 sm:opacity-30 brutal-float"
        style={{ animationDelay: "1s" }}
      >
        💊
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 text-center">
        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-[#ccff00] border-2 border-black font-mono text-xs font-black uppercase tracking-wider shadow-[4px_4px_0px_#000000]">
          <Terminal className="size-3.5" />
          <span>chain id: 4663 • 100% in-browser</span>
        </div>

        {/* Giant Stacked Headlines */}
        <h2 className="mt-6 font-heading text-5xl sm:text-7xl lg:text-8xl font-black lowercase tracking-tighter text-black leading-[0.95]">
          stop overpaying gas. <br />
          <span className="bg-black text-white px-3 py-1 inline-block -rotate-1 border-3 border-black shadow-[6px_6px_0px_#ccff00] mt-2">
            enter the trenches.
          </span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl font-sans text-base sm:text-xl font-medium text-black/90 leading-relaxed">
          batch token drops, 1-click token deployment, offline address grinding,
          and allowance revokes. zero tracking, zero middleman servers, 0%
          protocol cut.
        </p>

        {/* Dual Brutalist CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          {/* Wobble Button in Black */}
          <Link
            href="/tools"
            className="brutal-wobble inline-flex h-14 items-center gap-2 rounded-2xl bg-black px-8 font-heading text-lg font-black text-[#ccff00] border-4 border-black shadow-[6px_6px_0px_#000000] transition-transform duration-200 active:translate-x-1 active:translate-y-1"
          >
            <span>launch toolkit now</span>
            <ArrowUpRight className="size-5" />
          </Link>

          {/* White Button */}
          <Link
            href="/docs"
            className="inline-flex h-14 items-center gap-2 rounded-2xl bg-white px-7 font-heading text-lg font-black text-black border-4 border-black shadow-[6px_6px_0px_#000000] transition-transform duration-200 hover:-translate-y-1 active:translate-x-1 active:translate-y-1"
          >
            <BookOpen className="size-5" />
            <span>read docs</span>
          </Link>
        </div>

        {/* Live Chain Truth Badge */}
        <div className="mt-12 inline-flex items-center gap-3 bg-white/90 dark:bg-white/80 px-4 py-2 border-2 border-black font-mono text-xs font-bold shadow-[4px_4px_0px_#000000]">
          <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>14 client-side utilities online • zero custody</span>
        </div>
      </div>
    </section>
  );
}
