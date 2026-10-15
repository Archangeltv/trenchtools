import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { ConnectButton } from "@/components/connect-button";
import { MobileMenu } from "@/components/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/tools", label: "toolkit" },
  { href: "/tools/multisender", label: "multisender" },
  { href: "/tools/token-creator", label: "deploy" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 sm:border-b-3 border-black dark:border-neutral-800 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        {/* Logo Mark: Circle with single character or logo */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full py-1 transition-transform hover:-translate-y-0.5 shrink-0"
          aria-label="trench.tools home"
        >
          <div className="relative flex size-8 items-center justify-center rounded-full bg-black text-[#ccff00] font-black text-sm border-2 border-black overflow-hidden shadow-[2px_2px_0px_#000000]">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="size-full object-cover"
              priority
            />
          </div>
          <span className="font-heading text-base font-black lowercase tracking-tight text-black dark:text-white">
            trench<span className="text-[#ff0099]">.tools</span>
          </span>
        </Link>

        {/* Center Links inside compact Brutalist pill */}
        <nav className="hidden md:inline-flex items-center gap-1 rounded-full border-2 border-black bg-white dark:bg-neutral-900 p-1 shadow-[2px_2px_0px_#000000] dark:shadow-[2px_2px_0px_#ccff00]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 font-heading text-xs font-bold lowercase text-neutral-800 dark:text-neutral-200 hover:bg-[#ccff00] hover:text-black transition-all"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/token"
            className="inline-flex items-center gap-1 rounded-full border border-black bg-[#ccff00] px-2.5 py-1 font-mono text-[11px] font-black uppercase text-black hover:scale-105 transition-transform"
          >
            <span>$trench 0%</span>
            <ArrowUpRight className="size-3" strokeWidth={3} />
          </Link>
        </nav>

        {/* Right Action: Clean & uncrowded */}
        <div className="flex items-center gap-2 shrink-0">
          <ConnectButton />

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
