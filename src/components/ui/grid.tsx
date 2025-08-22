import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gridVariants = cva(
  "grid gap-6",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        5: "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
        auto: "grid-cols-1 md:grid-cols-2 lg:grid-cols-auto-fit",
      },
      gap: {
        sm: "gap-4",
        md: "gap-6", 
        lg: "gap-8",
        xl: "gap-12",
      },
      align: {
        start: "items-start",
        center: "items-center",
        stretch: "items-stretch",
      }
    },
    defaultVariants: {
      cols: 2,
      gap: "md",
      align: "stretch",
    },
  }
)

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, align, ...props }, ref) => {
    return (
      <div
        className={cn(gridVariants({ cols, gap, align, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Grid.displayName = "Grid"

// Specialized grid components for common patterns
const ServiceGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Grid
      ref={ref}
      cols={2}
      gap="lg"
      className={cn("max-w-4xl mx-auto", className)}
      {...props}
    />
  )
)
ServiceGrid.displayName = "ServiceGrid"

const FeatureGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Grid
      ref={ref}
      cols={3}
      gap="md"
      className={cn("max-w-6xl mx-auto", className)}
      {...props}
    />
  )
)
FeatureGrid.displayName = "FeatureGrid"

const MetricGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Grid
      ref={ref}
      cols={4}
      gap="md"
      align="center"
      className={cn("max-w-4xl mx-auto", className)}
      {...props}
    />
  )
)
MetricGrid.displayName = "MetricGrid"

const CaseGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Grid
      ref={ref}
      cols={3}
      gap="lg"
      className={cn("max-w-7xl mx-auto", className)}
      {...props}
    />
  )
)
CaseGrid.displayName = "CaseGrid"

export { 
  Grid, 
  gridVariants,
  ServiceGrid,
  FeatureGrid, 
  MetricGrid,
  CaseGrid
}