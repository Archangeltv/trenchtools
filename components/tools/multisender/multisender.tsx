"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useAccount } from "wagmi";

import { WalletGate } from "@/components/wallet-gate";
import { cn } from "@/lib/utils";
import { dedupeEntries, parseAddressList } from "@/lib/parse-addresses";

import { computeAllocations } from "./lib/compute";
import type {
  AmountMode,
  ApprovalStrategy,
  Erc20Token,
  SelectedToken,
  TokenKind,
} from "./lib/types";
import { StepRecipients } from "./step-recipients";
import { StepReview } from "./step-review";
import { StepSend } from "./step-send";
import { StepToken } from "./step-token";
import { useDisperse } from "./use-disperse";

type Step = 1 | 2 | 3 | 4;
type DedupeMode = "keep-first" | "merge-amounts";

const NATIVE_TOKEN: SelectedToken = {
  kind: "native",
  symbol: "ETH",
  decimals: 18,
};
const STEP_LABELS = ["Token", "Recipients", "Review", "Send"] as const;

export function Multisender() {
  return (
    <WalletGate>
      <MultisenderFlow />
    </WalletGate>
  );
}

function MultisenderFlow() {
  const { address, chainId } = useAccount();

  const [step, setStep] = useState<Step>(1);
  const [tokenKind, setTokenKind] = useState<TokenKind>("native");
  const [erc20Address, setErc20Address] = useState("");
  const [erc20Token, setErc20Token] = useState<Erc20Token | null>(null);
  const [rawText, setRawText] = useState("");
  const [mode, setMode] = useState<AmountMode>("custom");
  const [fixedAmount, setFixedAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [dedupeMode, setDedupeMode] = useState<DedupeMode>("keep-first");
  const [approvalStrategy, setApprovalStrategy] =
    useState<ApprovalStrategy>("total");

  const disperse = useDisperse();

  const selectedToken: SelectedToken | null =
    tokenKind === "native" ? NATIVE_TOKEN : erc20Token;
  const decimals = selectedToken?.decimals ?? 18;

  const parseResult = useMemo(() => parseAddressList(rawText), [rawText]);
  const finalEntries = useMemo(
    () => dedupeEntries(parseResult.entries, dedupeMode),
    [parseResult.entries, dedupeMode],
  );
  const compute = useMemo(
    () =>
      computeAllocations({
        entries: finalEntries,
        mode,
        decimals,
        fixedAmount,
        totalAmount,
      }),
    [finalEntries, mode, decimals, fixedAmount, totalAmount],
  );

  if (!address) return null;

  function resetForNewSend() {
    setRawText("");
    setFixedAmount("");
    setTotalAmount("");
    setStep(2);
  }

  return (
    <div className="space-y-6">
      <Stepper
        current={step}
        locked={step === 4}
        onStepChange={(s) => s < step && setStep(s)}
      />

      {step === 1 ? (
        <StepToken
          account={address}
          tokenKind={tokenKind}
          onTokenKindChange={(k) => {
            setTokenKind(k);
          }}
          erc20Address={erc20Address}
          onErc20AddressChange={setErc20Address}
          token={erc20Token}
          onTokenLoaded={setErc20Token}
          onNext={() => setStep(2)}
        />
      ) : null}

      {step === 2 && selectedToken ? (
        <StepRecipients
          symbol={selectedToken.symbol}
          rawText={rawText}
          onRawTextChange={setRawText}
          mode={mode}
          onModeChange={setMode}
          fixedAmount={fixedAmount}
          onFixedAmountChange={setFixedAmount}
          totalAmount={totalAmount}
          onTotalAmountChange={setTotalAmount}
          dedupeMode={dedupeMode}
          onDedupeModeChange={setDedupeMode}
          parseResult={parseResult}
          finalEntries={finalEntries}
          compute={compute}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      ) : null}

      {step === 3 && selectedToken ? (
        <StepReview
          account={address}
          token={selectedToken}
          allocations={compute.allocations}
          compute={compute}
          disperse={disperse}
          approvalStrategy={approvalStrategy}
          onApprovalStrategyChange={setApprovalStrategy}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      ) : null}

      {step === 4 && selectedToken ? (
        <StepSend
          account={address}
          chainId={chainId}
          token={selectedToken}
          allocations={compute.allocations}
          disperseAddress={disperse.address}
          approvalStrategy={approvalStrategy}
          onBack={() => setStep(3)}
          onReset={resetForNewSend}
        />
      ) : null}
    </div>
  );
}

function Stepper({
  current,
  locked,
  onStepChange,
}: {
  current: Step;
  locked: boolean;
  onStepChange: (step: Step) => void;
}) {
  return (
    <ol className="flex items-center gap-2">
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as Step;
        const done = n < current;
        const active = n === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={locked || n >= current}
              onClick={() => onStepChange(n)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-2.5 py-1 font-heading text-xs sm:text-sm font-bold lowercase transition-all",
                done && "text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800",
                active && "text-foreground font-black",
                !done && !active && "text-neutral-400",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg border-2 border-black font-mono text-xs font-black",
                  active && "bg-[#ccff00] text-black shadow-[2px_2px_0px_#000000]",
                  done && "bg-[#ff0099] text-white shadow-[2px_2px_0px_#000000]",
                  !done && !active && "bg-neutral-100 text-neutral-400 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700",
                )}
              >
                {done ? <Check className="size-4" strokeWidth={3} /> : n}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {i < STEP_LABELS.length - 1 ? (
              <span
                className={cn(
                  "h-1 flex-1 rounded-full",
                  n < current ? "bg-black dark:bg-[#ccff00]" : "bg-neutral-200 dark:bg-neutral-800",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
