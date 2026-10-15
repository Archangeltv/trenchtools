"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { AlertTriangle, ChevronDown, Wallet } from "lucide-react";

export function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#ccff00] px-3.5 py-1.5 font-heading text-xs font-black lowercase text-black shadow-[2px_2px_0px_#000000] hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    <Wallet className="size-3.5" />
                    <span>connect</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#ff0099] px-3 py-1 font-heading text-xs font-black text-white shadow-[2px_2px_0px_#000000] animate-pulse"
                  >
                    <AlertTriangle className="size-3.5" />
                    <span>wrong chain</span>
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white dark:bg-neutral-900 px-3 py-1 font-mono text-xs font-bold text-neutral-900 dark:text-white shadow-[2px_2px_0px_#000000] hover:bg-[#ccff00] hover:text-black transition-all"
                >
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>{account.displayName}</span>
                  <ChevronDown className="size-3 text-neutral-400" />
                </button>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
