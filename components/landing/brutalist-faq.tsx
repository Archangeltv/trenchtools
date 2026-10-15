"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
}

const faqs: FaqItem[] = [
  {
    question: "do you ever hold my private keys or funds?",
    answer:
      "never. trench.tools is 100% client-side. your browser speaks directly to robinhood chain rpc nodes using standard web3 providers (metamask, rabby, coinbase wallet). zero middleman servers, zero database logs, zero smart contract custody.",
    tag: "custody",
  },
  {
    question: "how is this free? what is the catch?",
    answer:
      "no catch. you pay raw network gas fees (usually <0.001 gwei on robinhood chain) directly to the network. our multisender, token creator, and calldata decoders have 0% protocol cut and 0 hidden fees.",
    tag: "fees",
  },
  {
    question: "why are some utilities labeled '100% offline'?",
    answer:
      "cryptographic operations like keccak256 hash generation, address checksum validation, and vanity address mining run entirely inside web workers in your browser sandbox. you can literally disconnect your wifi and the tools still work.",
    tag: "offline",
  },
  {
    question: "how do i add robinhood chain to metamask or rabby?",
    answer:
      "just hit 'connect wallet' or visit our network status page. we automatically prompt your wallet to switch to or add robinhood chain (chain id 4663) in a single click with instant gas parameters pre-configured.",
    tag: "network",
  },
  {
    question: "is the $trench token required to use the tools?",
    answer:
      "no. every single tool in the suite is freely accessible to anyone in the trenches. $trench is our zero-tax community token for believers in robinhood chain ecosystem tooling.",
    tag: "token",
  },
];

export function BrutalistFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative py-20 sm:py-28 bg-white dark:bg-[#0a0a0a] border-t-4 border-black dark:border-white/20">
      <div className="mx-auto w-full max-w-[800px] px-4 sm:px-6">
        {/* Section Pill Badge */}
        <div className="flex justify-center">
          <span className="inline-block px-4 py-1 text-xs font-mono font-black uppercase tracking-wider bg-[#ccff00] text-black border-2 border-black shadow-[3px_3px_0px_#000] rotate-[-1deg]">
            frequently asked questions
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="mt-4 text-center font-heading text-3xl sm:text-5xl font-black lowercase tracking-tight text-neutral-950 dark:text-white">
          got questions?{" "}
          <span className="underline decoration-[#7000ff] decoration-wavy decoration-2">
            real answers.
          </span>
        </h2>
        <p className="mt-3 text-center text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          no corporate talk, no marketing spin. just the facts about trench.tools.
        </p>

        {/* FAQ Accordion List */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden bg-white dark:bg-neutral-900 border-4 border-black dark:border-white/40 shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ccff00] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className={`w-full flex items-center justify-between gap-4 p-5 text-left font-heading text-base sm:text-lg font-bold lowercase transition-colors ${
                    isOpen
                      ? "bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white"
                      : "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-black text-white dark:bg-white dark:text-black">
                      {faq.tag}
                    </span>
                    <span>{faq.question}</span>
                  </div>

                  <span
                    className={`flex size-8 shrink-0 items-center justify-center border-2 border-black bg-[#ccff00] text-black font-black transition-transform duration-300 ${
                      isOpen ? "rotate-45 bg-[#ff0099] text-white" : ""
                    }`}
                  >
                    <Plus className="size-4" strokeWidth={3} />
                  </span>
                </button>

                {isOpen && (
                  <div className="border-t-2 border-black dark:border-white/20 p-5 bg-white dark:bg-neutral-950 font-sans text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
