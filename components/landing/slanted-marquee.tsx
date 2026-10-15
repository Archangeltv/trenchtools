"use client";

export function SlantedMarquee() {
  const items = [
    "BATCH MULTISENDER",
    "INSTANT TOKEN CREATOR",
    "APPROVAL REVOKER",
    "MERKLE AIRDROPS",
    "100% CLIENT-SIDE",
    "0% APP TAX",
    "ROBINHOOD CHAIN NATIVE",
    "ZERO CUSTODY",
    "DIRECT CHAIN RPC",
    "OFFLINE VANITY GRINDER",
  ];

  return (
    <div className="relative my-8 sm:my-14 w-full overflow-hidden py-4 z-20">
      <div className="-rotate-1 sm:-rotate-2 scale-105 border-y-4 border-black bg-[#0a0a0a] py-3.5 shadow-[0px_6px_0px_#000000]">
        <div className="flex w-max animate-marquee gap-8 font-heading text-sm sm:text-base font-extrabold uppercase tracking-wider text-white select-none">
          {Array.from({ length: 4 }).map((_, loopIdx) => (
            <div key={loopIdx} className="flex items-center gap-8">
              {items.map((item, idx) => (
                <div key={`${loopIdx}-${idx}`} className="flex items-center gap-8">
                  <span
                    className={
                      idx % 3 === 0
                        ? "text-[#ccff00]"
                        : idx % 3 === 1
                        ? "text-[#ff0099]"
                        : "text-white"
                    }
                  >
                    {item}
                  </span>
                  <span className="text-[#ccff00] text-xs">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
