import { ExternalLink, ShieldAlert, Sparkles, Zap, ShieldCheck } from "lucide-react";

import { CopyButton } from "@/components/copy-button";
import { tokenUrl } from "@/lib/explorer";

export function TokenPage({ address }: { address: string | null }) {
  return (
    <div className="relative min-h-[85vh] py-12 sm:py-20 bg-background">
      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6">
        {/* Token Header Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#ccff00] px-4 py-1.5 font-mono text-xs font-black uppercase text-black shadow-[3px_3px_0px_#000000]">
          <Sparkles className="size-3.5" />
          <span>official robinhood chain community token</span>
        </div>

        {/* Hero Title */}
        <div className="mt-5 flex flex-col items-start gap-3">
          <h1 className="font-heading text-6xl sm:text-8xl font-black lowercase tracking-tighter text-neutral-950 dark:text-white">
            <span className="text-[#ff0099]">$</span>trench
          </h1>
          <p className="font-sans text-lg sm:text-xl text-neutral-700 dark:text-neutral-300">
            the decentralized utility & community token fueling trench.tools.
          </p>
        </div>

        {/* Highlight Perks Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border-3 border-black bg-white p-5 shadow-[4px_4px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0px_#ccff00]">
            <div className="font-mono text-xs font-black uppercase text-neutral-500">tax policy</div>
            <div className="mt-2 font-heading text-2xl font-black text-[#7000ff] dark:text-[#ccff00]">0% buy / 0% sell</div>
            <p className="mt-1 font-sans text-xs text-neutral-600 dark:text-neutral-400">zero friction trading forever</p>
          </div>
          <div className="rounded-2xl border-3 border-black bg-white p-5 shadow-[4px_4px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0px_#ccff00]">
            <div className="font-mono text-xs font-black uppercase text-neutral-500">network</div>
            <div className="mt-2 font-heading text-2xl font-black text-black dark:text-white">robinhood chain</div>
            <p className="mt-1 font-sans text-xs text-neutral-600 dark:text-neutral-400">chain id 4663 L2 EVM</p>
          </div>
          <div className="rounded-2xl border-3 border-black bg-white p-5 shadow-[4px_4px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0px_#ccff00]">
            <div className="font-mono text-xs font-black uppercase text-neutral-500">governance</div>
            <div className="mt-2 font-heading text-2xl font-black text-[#ff0099]">community</div>
            <p className="mt-1 font-sans text-xs text-neutral-600 dark:text-neutral-400">100% public & decentralized</p>
          </div>
        </div>

        {/* Main Contract Card */}
        <div className="mt-10 rounded-3xl border-4 border-black bg-white p-6 sm:p-10 shadow-[8px_8px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[8px_8px_0px_#ccff00]">
          {address ? (
            <>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#ccff00] px-3.5 py-1 font-mono text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000]">
                  <ShieldCheck className="size-4" strokeWidth={3} />
                  <span>verified contract</span>
                </span>
                <span className="font-mono text-xs font-bold text-neutral-500">chain: 4663</span>
              </div>

              <h2 className="mt-5 font-heading text-2xl sm:text-3xl font-black lowercase tracking-tight text-neutral-950 dark:text-white">
                official contract address
              </h2>

              <div className="mt-4 flex items-center gap-2 rounded-2xl border-3 border-black bg-neutral-100 p-4 shadow-[4px_4px_0px_#000000] dark:bg-neutral-950 dark:border-neutral-700">
                <code className="min-w-0 flex-1 font-mono text-sm break-all font-bold text-neutral-900 dark:text-white">
                  {address}
                </code>
                <CopyButton
                  value={address}
                  label="Copy contract address"
                  className="shrink-0 rounded-xl border-2 border-black bg-[#ccff00] text-black font-black"
                />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href={tokenUrl(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-black px-6 py-3 font-heading text-sm font-black lowercase text-[#ccff00] shadow-[4px_4px_0px_#000000] hover:bg-[#7000ff] hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5"
                >
                  <span>view on blockscout</span>
                  <ExternalLink className="size-4" />
                </a>
              </div>

              <p className="mt-6 font-sans text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                only the contract address published above is the official $TRENCH token.
                always verify the address matches before swapping.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#ccff00] px-3.5 py-1 font-mono text-xs font-black uppercase text-black shadow-[2px_2px_0px_#000000]">
                <Zap className="size-3.5" />
                <span>contract deployment pending</span>
              </div>

              <h2 className="mt-5 font-heading text-2xl sm:text-3xl font-black lowercase tracking-tight text-neutral-950 dark:text-white">
                official address launching soon
              </h2>

              <p className="mt-2 font-sans text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
                when $TRENCH deploys on robinhood chain, the verified contract address will be published exclusively on this page.
              </p>

              <div className="mt-6 flex items-start gap-3 rounded-2xl border-3 border-black bg-amber-200 p-4 text-xs font-medium text-black shadow-[4px_4px_0px_#000000]">
                <ShieldAlert className="size-5 shrink-0 text-amber-900 mt-0.5" strokeWidth={2.5} />
                <div>
                  <span className="font-bold uppercase tracking-wide">protect your funds from impostor tokens:</span>
                  <p className="mt-0.5 opacity-90 leading-relaxed">
                    any token claiming to be $TRENCH prior to the address appearing on this official page is a scam.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
