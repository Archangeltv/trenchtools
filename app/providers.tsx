"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type Config, cookieToInitialState, WagmiProvider } from "wagmi";
import { ThemeProvider, useTheme } from "next-themes";
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { wagmiConfig } from "@/lib/wagmi";

function RainbowKitWrapper({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <RainbowKitProvider
      theme={
        resolvedTheme === "dark"
          ? darkTheme({
              accentColor: "#ccff00",
              accentColorForeground: "#000000",
              borderRadius: "large",
              overlayBlur: "small",
            })
          : lightTheme({
              accentColor: "#7000ff",
              accentColorForeground: "#ffffff",
              borderRadius: "large",
              overlayBlur: "small",
            })
      }
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const initialState = cookieToInitialState(wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <RainbowKitWrapper>{children}</RainbowKitWrapper>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
