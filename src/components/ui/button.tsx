import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-cloud hover:shadow-dreamy hover:scale-105 transition-cloud",
        secondary: "bg-card/90 backdrop-blur-md border border-border/50 text-foreground shadow-gentle hover:shadow-cloud hover:bg-card hover:border-accent hover:text-accent transition-cloud",
        accent: "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-dreamy hover:shadow-cloud hover:scale-105 transition-cloud font-semibold",
        destructive: "bg-destructive text-destructive-foreground shadow-gentle hover:bg-destructive/90",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-dreamy",
        link: "text-primary underline-offset-4 hover:underline transition-dreamy",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-full px-4 text-xs",
        lg: "h-14 rounded-full px-10 text-lg",
        xl: "h-16 rounded-full px-12 text-xl",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
