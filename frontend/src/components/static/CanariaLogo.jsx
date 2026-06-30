import { Bird } from "lucide-react";

import { cn } from "@/lib/utils";

export default function CanariaLogo({ className, showName = true, size = "default" }) {
  const iconSize = size === "sm" ? "size-7" : "size-8";
  const iconInner = size === "sm" ? "size-3.5" : "size-4";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  return (
    <span className={cn("group inline-flex items-center gap-2 font-semibold", className)}>
      <span
        className={cn(
          "flex items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary/20",
          iconSize,
        )}
      >
        <Bird className={iconInner} />
      </span>
      {showName && <span className={textSize}>Canaria</span>}
    </span>
  );
}
