import { Plane } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" aria-label="ProTravel">
      <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <Plane className="size-5 -rotate-12" aria-hidden="true" />
      </span>
      {!compact && (
        <span className={cn("text-lg font-bold tracking-tight")}>
          ProTravel
        </span>
      )}
    </div>
  );
}
