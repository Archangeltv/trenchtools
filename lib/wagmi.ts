import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { cookieStorage, createStorage, http } from "wagmi";

import { RPC_URL, robinhoodChain } from "@/lib/chain";

/** WalletConnect project ID (supports custom or fallback ID) */
export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  "2540702d73f4e3c9cf1c62f83652d3a3";

export const wagmiConfig = getDefaultConfig({
  appName: "trench.tools",
  projectId,
  chains: [robinhoodChain],
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  transports: { [robinhoodChain.id]: http(RPC_URL) },
});
