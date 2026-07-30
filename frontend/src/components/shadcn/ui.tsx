"use client";

// ──────────────────────────────────────────
// Button
// ──────────────────────────────────────────
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold",
    "transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]/50",
    "disabled:pointer-events-none disabled:opacity-40 select-none",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-[#6C63FF]/20 border border-[#6C63FF]/40 text-[#a299ff] hover:bg-[#6C63FF]/30 hover:border-[#6C63FF]/60",
        ghost:
          "bg-white/[0.04] border border-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white/80",
        destructive:
          "bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 hover:border-red-500/40",
        link:
          "text-[#6C63FF] underline-offset-4 hover:underline p-0 h-auto font-normal",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-9 px-4",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// ──────────────────────────────────────────
// Input
// ──────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg px-3 py-2 text-sm",
        "bg-white/[0.04] border border-white/10 text-white placeholder:text-white/30",
        "transition-[border-color,box-shadow] duration-150",
        "focus:outline-none focus:border-[#6C63FF]/50 focus:ring-2 focus:ring-[#6C63FF]/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

// ──────────────────────────────────────────
// Label
// ──────────────────────────────────────────
import * as LabelPrimitive from "@radix-ui/react-label";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-xs font-semibold text-white/50 tracking-wide leading-none",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Button, buttonVariants, Input, Label };
