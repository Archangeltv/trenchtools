"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Image as ImageIcon,
  RotateCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
} from "lucide-react";
import Papa from "papaparse";
import {
  erc20Abi,
  formatUnits,
  getAddress,
  isAddress,
  parseAbiItem,
} from "viem";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { addressUrl, tokenUrl } from "@/lib/explorer";
import { publicClient } from "@/lib/public-client";
import { cn } from "@/lib/utils";

export interface TokenMeta {
  standard: "erc20" | "erc721" | "erc1155";
  name: string;
  symbol: string;
  decimals: number;
}

export interface HolderRecord {
  rank: number;
  address: string;
  balance: number;
  formattedBalance: string;
  percentOfSupply: number;
}

const BURN_ADDRESSES = new Set([
  "0x0000000000000000000000000000000000000000".toLowerCase(),
  "0x000000000000000000000000000000000000dead".toLowerCase(),
]);

const POPULAR_PRESETS = [
  {
    name: "CASHCAT ($CASHCAT)",
    address: "0xe3b34C4bb0f12C82143745EEe6A6Cf4E3154b1fa",
    standard: "ERC-721 NFT",
  },
  {
    name: "TARTAGLIA ($TATA)",
    address: "0x96003d7d4f6b8d7466ce423fcecc916f7f901c90",
    standard: "ERC-20 Token",
  },
  {
    name: "Artificial Cat INU",
    address: "0xe14e6e6789ea3313440c0a9aad54ba31bf956a6c",
    standard: "ERC-721 NFT",
  },
  {
    name: "Uniswap v4 Positions",
    address: "0x58daec3116aae6d93017baaea7749052e8a04fa7",
    standard: "ERC-721 NFT",
  },
];

const erc165Abi = [
  parseAbiItem("function supportsInterface(bytes4 interfaceId) external view returns (bool)"),
];

const erc721Abi = [
  parseAbiItem("function name() external view returns (string)"),
  parseAbiItem("function symbol() external view returns (string)"),
];

export function SnapshotTool() {
  const autoDownloadId = useId();
  const excludeBurnId = useId();

  // Inputs
  const [contractInput, setContractInput] = useState("");

  // Options
  const [autoDownloadCsv, setAutoDownloadCsv] = useState(true);
  const [excludeBurn, setExcludeBurn] = useState(true);

  // Contract metadata
  const [tokenMeta, setTokenMeta] = useState<TokenMeta | null>(null);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);

  // Snapshot state
  const [isLoadingSnapshot, setIsLoadingSnapshot] = useState(false);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [results, setResults] = useState<HolderRecord[] | null>(null);
  const [downloadFilename, setDownloadFilename] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedMultisend, setCopiedMultisend] = useState<"weighted" | "flat" | null>(null);

  // File input ref for uploading CSV directly
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load contract metadata whenever contractInput is a valid address
  useEffect(() => {
    const trimmed = contractInput.trim();
    if (!isAddress(trimmed)) {
      setTokenMeta(null);
      setMetaError(null);
      return;
    }

    const checkAddr = getAddress(trimmed);
    let cancelled = false;
    setIsLoadingMeta(true);
    setMetaError(null);

    async function fetchMetadata() {
      try {
        const bytecode = await publicClient.getBytecode({ address: checkAddr });
        if (!bytecode || bytecode === "0x") {
          if (!cancelled) {
            setMetaError("No smart contract found at this address.");
            setTokenMeta(null);
            setIsLoadingMeta(false);
          }
          return;
        }

        // Detect ERC-721 or ERC-1155 via ERC-165
        const is721 = await publicClient
          .readContract({
            address: checkAddr,
            abi: erc165Abi,
            functionName: "supportsInterface",
            args: ["0x80ac58cd"],
          })
          .catch(() => false);

        const is1155 = is721
          ? false
          : await publicClient
              .readContract({
                address: checkAddr,
                abi: erc165Abi,
                functionName: "supportsInterface",
                args: ["0xd9b67a26"],
              })
              .catch(() => false);

        let detected: "erc20" | "erc721" | "erc1155" = is721
          ? "erc721"
          : is1155
            ? "erc1155"
            : "erc20";

        let name = "Unknown Token";
        let symbol = "TOKEN";
        let decimals = 18;

        if (detected === "erc721" || detected === "erc1155") {
          const [n, s] = await Promise.all([
            publicClient
              .readContract({ address: checkAddr, abi: erc721Abi, functionName: "name" })
              .catch(() => "NFT Collection"),
            publicClient
              .readContract({ address: checkAddr, abi: erc721Abi, functionName: "symbol" })
              .catch(() => "NFT"),
          ]);
          name = n;
          symbol = s;
          decimals = 0;
        } else {
          // Probe decimals to confirm ERC-20
          const [n, s, d] = await Promise.all([
            publicClient
              .readContract({ address: checkAddr, abi: erc20Abi, functionName: "name" })
              .catch(() => "Unknown Token"),
            publicClient
              .readContract({ address: checkAddr, abi: erc20Abi, functionName: "symbol" })
              .catch(() => "TOKEN"),
            publicClient
              .readContract({ address: checkAddr, abi: erc20Abi, functionName: "decimals" })
              .catch(() => null),
          ]);
          name = n;
          symbol = s;
          if (d === null) {
            // Probably an NFT without ERC-165
            detected = "erc721";
            decimals = 0;
          } else {
            decimals = d;
          }
        }

        if (!cancelled) {
          setTokenMeta({
            standard: detected,
            name,
            symbol,
            decimals,
          });
          setIsLoadingMeta(false);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Error inspecting contract";
          setMetaError(message);
          setTokenMeta(null);
          setIsLoadingMeta(false);
        }
      }
    }

    void fetchMetadata();
    return () => {
      cancelled = true;
    };
  }, [contractInput]);

  // Trigger client-side file download
  function triggerDownload(content: string, filename: string) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  // Parse Blockscout CSV content into records
  function parseAndSetHolders(csvText: string, projectName: string) {
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const rows = parsed.data as Record<string, string>[];
    if (!rows || rows.length === 0) {
      setSnapshotError("The holders CSV returned by Blockscout was empty.");
      return;
    }

    const holderList: HolderRecord[] = [];
    let totalBal = 0;

    for (const row of rows) {
      // Blockscout format: HolderAddress,Balance
      const addr = (
        row.HolderAddress ||
        row["Holder Address"] ||
        row.Address ||
        row.address ||
        ""
      ).trim();

      const rawVal = (
        row.Balance ||
        row.balance ||
        row.NFTCount ||
        row["NFT Count"] ||
        "0"
      ).trim();

      if (!isAddress(addr)) continue;
      const lowerAddr = addr.toLowerCase();
      if (excludeBurn && BURN_ADDRESSES.has(lowerAddr)) continue;

      const num = parseFloat(rawVal) || 0;
      if (num <= 0) continue;

      totalBal += num;
      holderList.push({
        rank: 0,
        address: getAddress(addr),
        balance: num,
        formattedBalance: rawVal,
        percentOfSupply: 0,
      });
    }

    // Sort descending by balance
    holderList.sort((a, b) => b.balance - a.balance);
    holderList.forEach((r, idx) => {
      r.rank = idx + 1;
      r.percentOfSupply = totalBal > 0 ? (r.balance / totalBal) * 100 : 0;
    });

    setResults(holderList);
  }

  // Execute snapshot via Blockscout API
  async function runSnapshot() {
    const trimmed = contractInput.trim();
    if (!isAddress(trimmed)) return;
    const targetAddr = getAddress(trimmed);

    const cleanProjectName =
      (tokenMeta?.name || tokenMeta?.symbol || "token")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "_")
        .replace(/^_+|_+$/g, "") || "holders";

    const expectedFilename = `trenchtoolscsv_${cleanProjectName}.csv`;
    setDownloadFilename(expectedFilename);
    setIsLoadingSnapshot(true);
    setSnapshotError(null);
    setResults(null);

    try {
      const res = await fetch(
        `/api/snapshot?address=${targetAddr}&name=${encodeURIComponent(cleanProjectName)}`,
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Blockscout returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const csvText = data.csv as string;

      if (!csvText) {
        throw new Error("Empty CSV response received from Blockscout");
      }

      // Parse and display
      parseAndSetHolders(csvText, cleanProjectName);

      // Auto download if enabled, renamed strictly to trenchtoolscsv_<project>.csv
      if (autoDownloadCsv) {
        triggerDownload(csvText, expectedFilename);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch snapshot from Blockscout";
      setSnapshotError(message);
    } finally {
      setIsLoadingSnapshot(false);
    }
  }

  // Handle uploaded CSV file directly
  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== "string") return;

      const cleanProjectName = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "_");

      setDownloadFilename(`trenchtoolscsv_${cleanProjectName}.csv`);
      parseAndSetHolders(text, cleanProjectName);

      if (!tokenMeta) {
        setTokenMeta({
          standard: "erc20",
          name: file.name.replace(/\.[^/.]+$/, ""),
          symbol: "CSV",
          decimals: 18,
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // Copy rows for Multisender
  async function copyForMultisender(mode: "weighted" | "flat" = "weighted") {
    if (!results) return;
    let lines: string[] = [];

    if (tokenMeta?.standard === "erc721" && mode === "flat") {
      lines = results.map((r) => `${r.address},1`);
    } else {
      lines = results.map((r) => `${r.address},${r.formattedBalance}`);
    }

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopiedMultisend(mode);
    setTimeout(() => setCopiedMultisend(null), 2000);
  }

  // Filtered results for search
  const displayedResults = useMemo(() => {
    if (!results) return [];
    if (!searchQuery.trim()) return results;
    const q = searchQuery.trim().toLowerCase();
    return results.filter(
      (r) => r.address.toLowerCase().includes(q) || r.rank.toString() === q,
    );
  }, [results, searchQuery]);

  // Aggregate stats
  const aggregateStats = useMemo(() => {
    if (!results) return null;
    const totalCount = results.reduce((acc, r) => acc + r.balance, 0);
    const topShare = results[0]?.percentOfSupply ?? 0;
    const isNft = tokenMeta?.standard === "erc721";

    return {
      totalHolders: results.length,
      totalHoldingsFormatted: isNft
        ? `${Math.round(totalCount).toLocaleString()} NFTs`
        : totalCount.toLocaleString("en-US", { maximumFractionDigits: 4 }),
      topShare,
      isNft,
    };
  }, [results, tokenMeta]);

  return (
    <div className="space-y-8">
      {/* Target Contract Configuration Card */}
      <div className="rounded-3xl border border-neutral-200/90 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Camera className="size-3.5 text-emerald-500" />
              Blockscout Official Holder Snapshot
            </span>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-mono">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Robinhood Chain (4663)
            </div>
          </div>

          <h2 className="mt-3 font-heading text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
            Select Target Contract
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Enter any token or NFT contract address. trench.tools fetches the verified holder snapshot directly from Blockscout and downloads <code className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">trenchtoolscsv_&lt;project&gt;.csv</code>.
          </p>
        </div>

        {/* Contract Address Input */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
            Contract Address
          </Label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="0x..."
                value={contractInput}
                onChange={(e) => setContractInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isAddress(contractInput.trim())) {
                    void runSnapshot();
                  }
                }}
                className="h-11 font-mono text-sm pr-9 rounded-xl border-neutral-200 bg-neutral-50/50 dark:border-neutral-700 dark:bg-neutral-800/50"
              />
              {contractInput && (
                <button
                  type="button"
                  onClick={() => setContractInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Paste Button */}
            <Button
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  const clip = await navigator.clipboard.readText();
                  if (clip) setContractInput(clip.trim());
                } catch {
                  // clipboard denied
                }
              }}
              className="h-11 rounded-xl text-xs font-semibold"
            >
              Paste
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-neutral-400">Quick Presets:</span>
            {POPULAR_PRESETS.map((preset) => (
              <button
                key={preset.address}
                type="button"
                onClick={() => setContractInput(preset.address)}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-100/80 px-2.5 py-1 text-[11px] font-medium text-neutral-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-emerald-700 dark:hover:text-emerald-400"
              >
                <span>{preset.name}</span>
                <span className="text-[10px] text-neutral-400 font-mono">({preset.standard})</span>
              </button>
            ))}
          </div>

          {/* Inspection Feedback */}
          {isLoadingMeta && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1 font-mono">
              <RotateCw className="size-3.5 animate-spin text-emerald-500" />
              Inspecting on-chain contract metadata…
            </div>
          )}

          {metaError && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 pt-1">
              <AlertCircle className="size-4 shrink-0" />
              <span>{metaError}</span>
            </div>
          )}

          {/* Live Contract Metadata Banner */}
          {tokenMeta && (
            <div className="mt-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-heading text-lg font-bold text-neutral-950 dark:text-white">
                      {tokenMeta.name}
                    </span>
                    <span className="rounded-md bg-emerald-200/70 px-2 py-0.5 font-mono text-xs font-bold text-emerald-900 dark:bg-emerald-900/70 dark:text-emerald-300">
                      ${tokenMeta.symbol}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                      {tokenMeta.standard === "erc721"
                        ? "ERC-721 NFT"
                        : tokenMeta.standard === "erc1155"
                          ? "ERC-1155 Multi-Token"
                          : "ERC-20 Token"}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-neutral-600 dark:text-neutral-300">
                    Target Filename:{" "}
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      trenchtoolscsv_
                      {(tokenMeta.name || tokenMeta.symbol)
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]+/g, "_")}
                      .csv
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={tokenUrl(contractInput.trim())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-50 transition-all dark:border-emerald-800 dark:bg-neutral-900 dark:text-emerald-300"
                  >
                    View on Blockscout
                    <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Auto download toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 dark:border-neutral-700/80 dark:bg-neutral-800/40">
              <div className="space-y-0.5">
                <Label
                  htmlFor={autoDownloadId}
                  className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5"
                >
                  <Download className="size-3.5 text-emerald-500" />
                  Auto-Download trenchtoolscsv
                </Label>
                <p className="text-[11px] text-neutral-500">
                  Instantly triggers browser download renamed with project name.
                </p>
              </div>
              <Switch
                id={autoDownloadId}
                checked={autoDownloadCsv}
                onCheckedChange={setAutoDownloadCsv}
              />
            </div>

            {/* Exclude burn toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-3.5 dark:border-neutral-700/80 dark:bg-neutral-800/40">
              <div className="space-y-0.5">
                <Label
                  htmlFor={excludeBurnId}
                  className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5"
                >
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  Exclude Burn Addresses
                </Label>
                <p className="text-[11px] text-neutral-500">
                  Filters 0x000...000 and 0x000...dEaD from holder ranks.
                </p>
              </div>
              <Switch
                id={excludeBurnId}
                checked={excludeBurn}
                onCheckedChange={setExcludeBurn}
              />
            </div>
          </div>
        </div>

        {/* Snapshot Error Feedback */}
        {snapshotError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="size-4 shrink-0" />
            <span>{snapshotError}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            disabled={!isAddress(contractInput.trim()) || isLoadingSnapshot}
            onClick={() => void runSnapshot()}
            className="flex-1 h-12 rounded-full bg-emerald-500 text-sm font-bold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 hover:shadow-lg transition-all"
          >
            {isLoadingSnapshot ? (
              <>
                <RotateCw className="size-4 mr-2 animate-spin" />
                Fetching & Renaming Blockscout CSV…
              </>
            ) : (
              <>
                <Camera className="size-4 mr-2" />
                Take Holder Snapshot & Download trenchtoolscsv
              </>
            )}
          </Button>

          {/* Upload CSV Option */}
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="h-12 rounded-full px-6 text-xs font-semibold"
          >
            <FileSpreadsheet className="size-4 mr-1.5 text-emerald-500" />
            Upload CSV
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Snapshot Results Dashboard */}
      {results && (
        <div className="rounded-3xl border border-neutral-200/90 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 space-y-6 animate-in fade-in duration-300">
          {/* Header & Metrics */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </span>
                <h3 className="font-heading text-xl font-bold tracking-tight text-neutral-950 dark:text-white sm:text-2xl">
                  Snapshot Results: {tokenMeta?.name || "Verified Asset"}
                </h3>
              </div>
              <p className="mt-1 text-xs text-neutral-500 font-mono">
                {results.length.toLocaleString()} verified holders · File:{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {downloadFilename}
                </span>
              </p>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Download CSV button */}
              {isAddress(contractInput.trim()) && (
                <a
                  href={`/api/snapshot?address=${contractInput.trim()}&name=${encodeURIComponent(
                    tokenMeta?.name || tokenMeta?.symbol || "token",
                  )}&download=1`}
                  download={downloadFilename || "trenchtoolscsv.csv"}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-emerald-500 px-5 text-xs font-bold text-white shadow-sm hover:bg-emerald-600 transition-all"
                >
                  <Download className="size-3.5" />
                  Download {downloadFilename || "CSV"}
                </a>
              )}

              {/* Copy for Multisender buttons */}
              {tokenMeta?.standard === "erc721" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void copyForMultisender("weighted")}
                    className="h-10 rounded-full text-xs font-semibold"
                    title="Copies address,amount rows for weighted airdrop"
                  >
                    {copiedMultisend === "weighted" ? (
                      <>
                        <Check className="size-3.5 mr-1.5 text-emerald-500" />
                        Copied Weighted!
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 mr-1.5" />
                        Copy Weighted (address,count)
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void copyForMultisender("flat")}
                    className="h-10 rounded-full text-xs font-semibold"
                    title="Copies address,1 rows for flat 1-per-wallet airdrop"
                  >
                    {copiedMultisend === "flat" ? (
                      <>
                        <Check className="size-3.5 mr-1.5 text-emerald-500" />
                        Copied 1-Per-Holder!
                      </>
                    ) : (
                      <>
                        <Users className="size-3.5 mr-1.5" />
                        Copy 1 Per Holder (address,1)
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void copyForMultisender("weighted")}
                  className="h-10 rounded-full text-xs font-semibold"
                  title="Copies address,balance rows ready to paste into Multisender"
                >
                  {copiedMultisend ? (
                    <>
                      <Check className="size-3.5 mr-1.5 text-emerald-500" />
                      Copied Airdrop Rows!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5 mr-1.5" />
                      Copy for Multisender
                    </>
                  )}
                </Button>
              )}

              {/* Direct link to Multisender */}
              <Link
                href="/tools/multisender"
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-4 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:text-white"
              >
                Open Multisender
                <ArrowUpRight className="size-3.5 text-neutral-400" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          {aggregateStats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                <span className="text-[11px] font-semibold uppercase text-neutral-400">
                  {aggregateStats.isNft ? "Unique Collectors" : "Total Holders"}
                </span>
                <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
                  {aggregateStats.totalHolders.toLocaleString()}
                </div>
                <p className="text-[10px] text-neutral-500">Verified addresses</p>
              </div>

              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                <span className="text-[11px] font-semibold uppercase text-neutral-400">
                  {aggregateStats.isNft ? "Total NFTs" : "Total Supply Accounted"}
                </span>
                <div className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {aggregateStats.totalHoldingsFormatted}
                </div>
                <p className="text-[10px] text-neutral-500">Active circulating</p>
              </div>

              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/40">
                <span className="text-[11px] font-semibold uppercase text-neutral-400">
                  {aggregateStats.isNft ? "Top Collector Share" : "Whale Dominance"}
                </span>
                <div className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-white">
                  {aggregateStats.topShare.toFixed(2)}%
                </div>
                <p className="text-[10px] text-neutral-500">Held by #1 rank wallet</p>
              </div>
            </div>
          )}

          {/* Search Table Toolbar */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search holder address or rank…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 text-xs rounded-xl"
              />
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Showing {displayedResults.length.toLocaleString()} of {results.length.toLocaleString()}
            </div>
          </div>

          {/* Holders Table */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-neutral-100/90 text-neutral-600 backdrop-blur-sm dark:bg-neutral-800/90 dark:text-neutral-300 font-semibold border-b border-neutral-200 dark:border-neutral-700">
                  <tr>
                    <th className="py-3 px-4 w-16">Rank</th>
                    <th className="py-3 px-4">Holder Address</th>
                    <th className="py-3 px-4 text-right">
                      {tokenMeta?.standard === "erc721"
                        ? "NFTs Held"
                        : `Balance (${tokenMeta?.symbol || "Tokens"})`}
                    </th>
                    <th className="py-3 px-4 text-right w-44">
                      {tokenMeta?.standard === "erc721" ? "% of Collection" : "% of Supply"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80 bg-white dark:bg-neutral-900">
                  {displayedResults.map((holder) => (
                    <tr
                      key={holder.address}
                      className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-neutral-500">
                        #{holder.rank}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-semibold text-neutral-900 dark:text-white">
                            {holder.address.slice(0, 10)}…{holder.address.slice(-8)}
                          </code>
                          <CopyButton value={holder.address} className="size-6 p-0" />
                          <a
                            href={addressUrl(holder.address)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-emerald-500 transition-colors"
                            title="View on Blockscout"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-white">
                        {holder.balance.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{
                                width: `${Math.min(100, Math.max(2, holder.percentOfSupply))}%`,
                              }}
                            />
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 w-12 text-right">
                            {holder.percentOfSupply.toFixed(2)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {displayedResults.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-400">
                        No holder matching &ldquo;{searchQuery}&rdquo;
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
