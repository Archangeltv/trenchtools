import {
  Focus,
  KeyRound,
  ServerOff,
  ShieldCheck,
  type LucideIcon,
  WifiOff,
} from "lucide-react";

const principles: { icon: LucideIcon; title: string; body: string; tag: string }[] = [
  {
    icon: KeyRound,
    title: "You hold the keys",
    body: "You review, approve, and fund every transaction directly from your own wallet. Zero smart contract proxying, zero custodial holding.",
    tag: "Self-Custodial",
  },
  {
    icon: Focus,
    title: "Dedicated to Robinhood Chain",
    body: "Optimized exclusively for Robinhood Chain. No clunky network selectors or irrelevant multi-chain clutter.",
    tag: "Native Chain",
  },
  {
    icon: WifiOff,
    title: "Offline where it counts",
    body: "Vanity address grinding, keccak256 hashing, and merkle proof generation run 100% in your browser without ever touching a network.",
    tag: "Zero Leakage",
  },
  {
    icon: ServerOff,
    title: "Zero server storage",
    body: "No databases, no tracking cookies, and no analytical telemetry. All state lives strictly in your browser session and disappears when you close the tab.",
    tag: "Zero Logging",
  },
];

export function Principles() {
  return (
    <section className="relative border-t border-neutral-200/60 bg-white py-20 dark:border-neutral-800/60 dark:bg-neutral-900/60 sm:py-28">
      {/* Background Architectural Grid Lines */}
      <div className="pointer-events-none absolute inset-0 bg-grid-tech opacity-40" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
            <ShieldCheck className="size-3" />
            Core Architecture
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-4xl">
            Built to stay out of your way
          </h2>
          <p className="mt-3 text-base text-neutral-600 dark:text-neutral-300">
            Engineered with strict client-side principles that keep everyday activities fast, private, and mathematically verifiable.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {principles.map((principle) => {
            const Icon = principle.icon;
            return (
              <div
                key={principle.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-emerald-800"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-md group-hover:shadow-emerald-500/30 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Icon className="size-5.5" />
                    </span>
                    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                      {principle.tag}
                    </span>
                  </div>

                  <div className="mt-5 space-y-1.5">
                    <h3 className="font-heading text-lg font-bold tracking-tight text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors dark:group-hover:text-emerald-400">
                      {principle.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                      {principle.body}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <div className="h-0.5 w-8 bg-neutral-200 transition-all duration-300 group-hover:w-full group-hover:bg-emerald-500 dark:bg-neutral-800" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
