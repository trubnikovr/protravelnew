import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/10 disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Select.displayName = "Select";
