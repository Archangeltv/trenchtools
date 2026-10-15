import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border-2 border-black bg-white px-3.5 py-1 text-base font-mono shadow-[2px_2px_0px_#000000] transition-all outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-400 focus-visible:border-black focus-visible:shadow-[3px_3px_0px_#ccff00] disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-[2px_2px_0px_#ccff00] dark:focus-visible:border-[#ccff00]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
