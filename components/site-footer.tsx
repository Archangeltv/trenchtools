import Link from "next/link";
import { TelegramIcon, XIcon } from "@/components/social-icons";
import { TELEGRAM_URL, X_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t-8 border-black bg-white dark:bg-[#0a0a0a] text-black dark:text-white">
      {/* Massive 10vw background watermark text with 5% opacity */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <span className="font-heading font-black text-[12vw] leading-none tracking-tighter text-black/5 dark:text-white/5 whitespace-nowrap">
          trench.tools
        </span>
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-heading text-xl font-black lowercase tracking-tight">
              trench<span className="text-[#ff0099]">.tools</span>
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#ccff00] text-black border border-black">
              chain 4663
            </span>
          </div>
          <p className="max-w-md font-sans text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            everyday high-speed utilities for robinhood chain. 100% client-side,
            zero tracking, zero custodial contracts.
          </p>
        </div>

        {/* Brutalist Pill Links */}
        <nav className="flex flex-wrap items-center gap-2.5 text-xs">
          <Link
            href="/tools"
            className="rounded-full border-2 border-black bg-white dark:bg-neutral-900 px-3.5 py-1.5 font-bold shadow-[2px_2px_0px_#000000] hover:-translate-y-0.5 hover:bg-[#ccff00] hover:text-black transition-all"
          >
            all tools
          </Link>
          <Link
            href="/docs"
            className="rounded-full border-2 border-black bg-white dark:bg-neutral-900 px-3.5 py-1.5 font-bold shadow-[2px_2px_0px_#000000] hover:-translate-y-0.5 hover:bg-[#ccff00] hover:text-black transition-all"
          >
            docs
          </Link>
          <Link
            href="/token"
            className="rounded-full border-2 border-black bg-[#ccff00] text-black px-3.5 py-1.5 font-bold shadow-[2px_2px_0px_#000000] hover:-translate-y-0.5 transition-all"
          >
            $trench
          </Link>
          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white dark:bg-neutral-900 px-3.5 py-1.5 font-bold shadow-[2px_2px_0px_#000000] hover:-translate-y-0.5 hover:bg-[#7000ff] hover:text-white transition-all"
          >
            <XIcon className="size-3.5" />
            <span>x</span>
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white dark:bg-neutral-900 px-3.5 py-1.5 font-bold shadow-[2px_2px_0px_#000000] hover:-translate-y-0.5 hover:bg-[#0088cc] hover:text-white transition-all"
          >
            <TelegramIcon className="size-3.5" />
            <span>telegram</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
