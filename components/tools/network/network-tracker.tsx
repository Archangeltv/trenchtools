"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Clock,
  ExternalLink,
  Flame,
  Pause,
  Play,
  RotateCw,
} from "lucide-react";
import { formatGwei } from "viem";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RPC_URL, robinhoodChain } from "@/lib/chain";
import { EXPLORER_URL, blockUrl } from "@/lib/explorer";
import { publicClient } from "@/lib/public-client";
import { cn } from "@/lib/utils";

const POLL_INTERVAL = 5000;
const BLOCK_SAMPLE = 30;
const TABLE_ROWS = 10;

interface BlockRow {
  number: bigint;
  timestamp: number;
  txCount: number;
  gasUsed: bigint;
  gasLimit: bigint;
}

interface Snapshot {
  gasPriceWei: bigint;
  latestBlockNumber: bigint;
  latestBlockTimestamp: number;
  avgBlockTimeSec: number | null;
  latencyMs: number;
  blocks: BlockRow[];
}

async function fetchSnapshot(): Promise<Snapshot> {
  const start = performance.now();
  const [gasPriceWei, tip] = await Promise.all([
    publicClient.getGasPrice(),
    publicClient.getBlockNumber(),
  ]);

  const numbers: bigint[] = [];
  for (let i = 0; i < BLOCK_SAMPLE; i++) {
    const n = tip - BigInt(i);
    if (n < 0n) break;
    numbers.push(n);
  }
  const blocks = await Promise.all(
    numbers.map((n) => publicClient.getBlock({ blockNumber: n })),
  );
  const latencyMs = performance.now() - start;

  const timestamps = blocks.map((block) => Number(block.timestamp));
  let avgBlockTimeSec: number | null = null;
  if (timestamps.length > 1) {
    const span = timestamps[0] - timestamps[timestamps.length - 1];
    avgBlockTimeSec = span / (timestamps.length - 1);
  }

  const rows: BlockRow[] = blocks.slice(0, TABLE_ROWS).map((block, index) => ({
    number: numbers[index],
    timestamp: Number(block.timestamp),
    txCount: block.transactions.length,
    gasUsed: block.gasUsed,
    gasLimit: block.gasLimit,
  }));

  return {
    gasPriceWei,
    latestBlockNumber: tip,
    latestBlockTimestamp: Number(blocks[0].timestamp),
    avgBlockTimeSec,
    latencyMs,
    blocks: rows,
  };
}

function toSignificant(value: number, digits: number): string {
  if (!Number.isFinite(value) || value === 0) return "0";
  return Number(value.toPrecision(digits)).toString();
}

function ageLabel(timestamp: number, nowSec: number): string {
  const delta = Math.max(0, nowSec - timestamp);
  if (delta < 2) return "just now";
  if (delta < 60) return `${delta}s ago`;
  const mins = Math.floor(delta / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

type Health = "lime" | "amber" | "red";

export function NetworkTracker() {
  const [paused, setPaused] = useState(false);
  const [nowSec, setNowSec] = useState(() => Math.floor(Date.now() / 1000));

  const { data, isError, isFetching, isLoading, refetch } = useQuery({
    queryKey: ["network-snapshot"],
    queryFn: fetchSnapshot,
    refetchInterval: paused ? false : POLL_INTERVAL,
  });

  useEffect(() => {
    const id = setInterval(
      () => setNowSec(Math.floor(Date.now() / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, []);

  const health: Health = isError
    ? "red"
    : data
      ? data.latencyMs < 1000
        ? "lime"
        : data.latencyMs < 3000
          ? "amber"
          : "red"
      : "amber";

  const gasGwei = data ? Number(formatGwei(data.gasPriceWei)) : 0;

  return (
    <div className="space-y-8">
      {/* Top Telemetry Status Pill Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0px_#ccff00]">
        <div className="flex items-center gap-3">
          <span className="flex size-3 items-center justify-center">
            <span
              className={cn(
                "size-2.5 rounded-full",
                health === "lime"
                  ? "bg-emerald-500 shadow-emerald-500/50 shadow-sm"
                  : health === "amber"
                    ? "bg-amber-500"
                    : "bg-red-500",
                !paused && !isError && "animate-pulse"
              )}
            />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-white">
                {isError
                  ? "RPC Unreachable"
                  : paused
                    ? "Telemetry Paused"
                    : isLoading
                      ? "Connecting to Robinhood Node…"
                      : "Live Network Stream"}
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Robinhood Chain
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {data ? `Roundtrip latency: ${Math.round(data.latencyMs)} ms` : "Querying public RPC…"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPaused((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-800 shadow-2xs hover:border-emerald-300 hover:bg-neutral-50 transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            {paused ? (
              <>
                <Play className="size-3 text-emerald-500" />
                Resume Stream
              </>
            ) : (
              <>
                <Pause className="size-3 text-neutral-500" />
                Pause Stream
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => void refetch()}
            className="flex size-8 items-center justify-center rounded-full border border-neutral-200/90 bg-white text-neutral-600 shadow-2xs hover:border-emerald-300 hover:text-emerald-600 transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            title="Refresh now"
          >
            <RotateCw className={cn("size-3.5", isFetching && "animate-spin text-emerald-500")} />
          </button>
        </div>
      </div>

      {isError && !data ? (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-5 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <div className="flex items-center gap-2 font-semibold">
            <AlertTriangle className="size-4 text-red-500" />
            Cannot reach Robinhood Chain RPC
          </div>
          <p className="mt-1 text-xs text-red-700/80 dark:text-red-300/80">
            The request to {RPC_URL} failed. Please verify your internet connection.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="mt-3 rounded-full"
          >
            Retry Connection
          </Button>
        </div>
      ) : null}

      {/* 4 Creative Telemetry Cards: Green Primary + Cyber Lemon & Yellow Accents */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Gas Price (Green Primary) */}
        <div className="glass-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Gas Price
              </span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Flame className="size-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
                {data ? toSignificant(gasGwei, 4) : <Skeleton className="h-8 w-20" />}
              </span>
              <span className="text-sm font-semibold text-neutral-500">Gwei</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full w-2/3 bg-striped-green" />
            </div>
            <span className="mt-1.5 block text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
              ~99% cheaper than Ethereum L1
            </span>
          </div>
        </div>

        {/* Card 2: Latest Block (Lemon Lime Accent) */}
        <div className="glass-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-lime-400">
          <div className="absolute top-0 right-0 h-16 w-16 bg-lime-500/10 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Latest Block
              </span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-lime-500/10 text-lime-700 dark:bg-lime-950 dark:text-lime-300">
                <Boxes className="size-4" />
              </span>
            </div>
            <div className="mt-4">
              <span className="font-mono text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white truncate block">
                {data ? `#${data.latestBlockNumber.toLocaleString()}` : <Skeleton className="h-8 w-24" />}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              <div className="h-full w-4/5 bg-striped-lemon" />
            </div>
            <span className="mt-1.5 block text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
              {data ? ageLabel(data.latestBlockTimestamp, nowSec) : "Instant Finality"}
            </span>
          </div>
        </div>

        {/* Card 3: Avg Block Time */}
        <div className="glass-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-emerald-300">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Block Production
              </span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Clock className="size-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {data && data.avgBlockTimeSec !== null ? (
                  data.avgBlockTimeSec.toFixed(2)
                ) : (
                  "0.25"
                )}
              </span>
              <span className="text-sm font-semibold text-neutral-500">sec</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span className="block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Sub-second block production
            </span>
          </div>
        </div>

        {/* Card 4: RPC Latency (Cyber Yellow Accent) */}
        <div className="glass-card relative flex flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-yellow-400">
          <div className="absolute top-0 right-0 h-16 w-16 bg-yellow-500/10 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                RPC Latency
              </span>
              <span className="flex size-7 items-center justify-center rounded-lg bg-yellow-500/10 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                <Activity className="size-4" />
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                {data ? Math.round(data.latencyMs) : <Skeleton className="h-8 w-16" />}
              </span>
              <span className="text-sm font-semibold text-neutral-500">ms</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-600 dark:text-neutral-300">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Public RPC Operational
            </span>
          </div>
        </div>
      </div>

      {/* Network Specs Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-2xl border-3 border-black bg-white p-4 shadow-[4px_4px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[4px_4px_0px_#ccff00]">
        <div>
          <span className="font-mono text-[10px] font-black uppercase text-neutral-500">
            Network ID
          </span>
          <div className="font-mono text-sm font-black text-neutral-900 dark:text-[#ccff00]">
            {robinhoodChain.id}
          </div>
        </div>
        <div>
          <span className="font-mono text-[10px] font-black uppercase text-neutral-500">
            Native Currency
          </span>
          <div className="font-mono text-sm font-black text-neutral-900 dark:text-white">
            ETH (18 Decimals)
          </div>
        </div>
        <div className="min-w-0">
          <span className="font-mono text-[10px] font-black uppercase text-neutral-500">
            Public RPC
          </span>
          <div className="truncate font-mono text-xs font-bold text-[#7000ff] dark:text-[#ccff00]">
            {RPC_URL}
          </div>
        </div>
        <div>
          <span className="font-mono text-[10px] font-black uppercase text-neutral-500">
            Official Explorer
          </span>
          <div>
            <a
              href={EXPLORER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs font-bold text-neutral-900 hover:text-[#7000ff] dark:text-white dark:hover:text-[#ccff00]"
            >
              Blockscout
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Real-time Block Stream */}
      <div className="rounded-3xl border-3 border-black bg-white p-6 shadow-[6px_6px_0px_#000000] dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-[6px_6px_0px_#ccff00]">
        <div className="flex items-center justify-between pb-5 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="font-heading text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
              Live Block Stream
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Latest mined blocks on Robinhood Chain.
            </p>
          </div>
          {isFetching && !isError ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1 text-xs font-semibold text-lime-900 ring-1 ring-lime-300 dark:bg-lime-950/60 dark:text-lime-300">
              <span className="size-1.5 rounded-full bg-lime-500 animate-ping" />
              Polling Tip…
            </span>
          ) : null}
        </div>

        {/* Blocks List */}
        <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800/80">
          {data
            ? data.blocks.map((block) => {
                const pct =
                  block.gasLimit > 0n
                    ? (Number(block.gasUsed) / Number(block.gasLimit)) * 100
                    : 0;
                return (
                  <div
                    key={block.number.toString()}
                    className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 rounded-xl px-2"
                  >
                    {/* Block Number & Age */}
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-950 dark:text-emerald-400">
                        <Boxes className="size-4" />
                      </span>
                      <div>
                        <a
                          href={blockUrl(block.number)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-sm font-bold text-neutral-900 hover:text-emerald-600 transition-colors dark:text-white dark:hover:text-emerald-400 inline-flex items-center gap-1"
                        >
                          #{block.number.toLocaleString()}
                          <ArrowUpRight className="size-3 text-neutral-400" />
                        </a>
                        <p className="text-xs text-neutral-400">
                          {ageLabel(block.timestamp, nowSec)}
                        </p>
                      </div>
                    </div>

                    {/* Transactions count & Gas Utilization */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          {block.txCount} txs
                        </span>
                      </div>

                      <div className="flex w-36 flex-col items-end gap-1">
                        <span className="font-mono text-[11px] text-neutral-400">
                          {block.gasUsed.toLocaleString()} gas
                        </span>
                        <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-striped-green rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(100, Math.max(pct, pct > 0 ? 3 : 0))}%`,
                            }}
                          />
                        </div>
                      </div>

                      <a
                        href={blockUrl(block.number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex size-7 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-emerald-500 hover:text-white transition-all dark:bg-neutral-800 dark:text-neutral-300"
                        title="View on explorer"
                      >
                        <ArrowUpRight className="size-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            : Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="flex items-center justify-between py-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
