import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // AURA variants
        pill: "rounded-full bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 active:scale-[0.98] transition-[transform,background-color] duration-300 ease-calm",
        brand:
          "rounded-full bg-brand text-brand-foreground shadow-soft hover:bg-brand-strong active:scale-[0.98] transition-[transform,background-color] duration-300 ease-calm",
        glass:
          "rounded-full glass text-foreground hover:bg-card/80 active:scale-[0.98] transition-[transform,background-color] duration-300 ease-calm",
        quiet:
          "rounded-full bg-secondary text-secondary-foreground hover:bg-accent active:scale-[0.98] transition-[transform,background-color] duration-300 ease-calm",
        hairline:
          "rounded-full border border-foreground/10 bg-card/60 text-foreground hover:bg-card active:scale-[0.98] transition-[transform,background-color] duration-300 ease-calm",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-full px-7",
        xl: "h-14 rounded-full px-9 text-base",
        icon: "h-9 w-9",
        "icon-lg": "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
