import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-guild bg-muted/60 border border-border/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
