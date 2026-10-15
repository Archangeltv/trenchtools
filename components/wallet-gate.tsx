"use client";

import type { ReactNode } from "react";
import { Wallet } from "lucide-react";
import { useAccount } from "wagmi";

import { ConnectButton } from "@/components/connect-button";
import { Card, CardContent } from "@/components/ui/card";

export function WalletGate({ children }: { children: ReactNode }) {
  const { isConnected } = useAccount();

  if (isConnected) return <>{children}</>;

  return (
    <Card className="border-3 border-black shadow-[6px_6px_0px_#000000] dark:border-neutral-700 dark:shadow-[6px_6px_0px_#ccff00]">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-black bg-[#ccff00] text-black shadow-[3px_3px_0px_#000000]">
          <Wallet className="size-7" strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <p className="font-heading text-xl font-black lowercase text-black dark:text-white">
            connect your wallet
          </p>
          <p className="max-w-sm font-sans text-sm text-neutral-600 dark:text-neutral-400">
            this tool needs a wallet connected to robinhood chain to execute transactions.
          </p>
        </div>
        <div className="mt-2">
          <ConnectButton />
        </div>
      </CardContent>
    </Card>
  );
}
