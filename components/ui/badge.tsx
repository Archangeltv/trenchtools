import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xl border-2 border-black px-2.5 py-0.5 font-mono text-[11px] font-black uppercase whitespace-nowrap transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-[#ccff00] text-black shadow-[2px_2px_0px_#000000]",
        secondary:
          "bg-[#7000ff] text-white shadow-[2px_2px_0px_#000000]",
        destructive:
          "bg-[#ff0099] text-white shadow-[2px_2px_0px_#000000]",
        outline:
          "border-2 border-black bg-white dark:bg-neutral-900 text-black dark:text-white shadow-[2px_2px_0px_#000000]",
        ghost:
          "hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white",
        link: "text-[#7000ff] dark:text-[#ccff00] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
