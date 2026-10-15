import type { Metadata } from "next";

import { SnapshotTool } from "@/components/tools/snapshot/snapshot-tool";
import { ToolPage } from "@/components/tool-page";
import { toolJsonLd, toolPageMetadata } from "@/lib/seo";

export const metadata: Metadata = toolPageMetadata("snapshot");

const steps = [
  {
    title: "Enter contract address",
    body: "Enter any ERC-20 token or ERC-721 / ERC-1155 NFT contract on Robinhood Chain, or click one of the quick presets.",
  },
  {
    title: "Official Blockscout extraction",
    body: "The engine pulls verified holder records directly from Robinhood Chain's Blockscout explorer index in sub-second speed.",
  },
  {
    title: "Auto-download trenchtoolscsv",
    body: "The verified holder list is automatically downloaded as trenchtoolscsv_<project>.csv with full precision balances.",
  },
  {
    title: "1-Click Multisender airdrops",
    body: "Copy rows in address,amount format (weighted by holdings or 1 per collector) and paste directly into the Multisender.",
  },
];

export default function SnapshotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toolJsonLd("snapshot") }}
      />
      <ToolPage slug="snapshot" steps={steps}>
        <SnapshotTool />
      </ToolPage>
    </>
  );
}
