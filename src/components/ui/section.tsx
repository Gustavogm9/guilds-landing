import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const sectionVariants = cva(
  "w-full",
  {
    variants: {
      spacing: {
        xs: "py-6 md:py-8",
        sm: "py-8 md:py-12",
        md: "py-12 md:py-16", 
        lg: "py-16 md:py-20",
        xl: "py-20 md:py-24",
      },
      background: {
        default: "bg-background",
        muted: "bg-muted/30",
        accent: "bg-accent/5",
        dark: "bg-foreground text-background",
        gradient: "bg-gradient-to-br from-background via-muted/20 to-accent/10",
      },
      container: {
        default: "container mx-auto px-6",
        fluid: "px-6",
        narrow: "container mx-auto px-6 max-w-4xl",
        wide: "container mx-auto px-6 max-w-7xl",
      }
    },
    defaultVariants: {
      spacing: "sm",
      background: "default", 
      container: "default",
    },
  }
)

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  as?: React.ElementType
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, container, as: Comp = "section", ...props }, ref) => {
    return (
      <Comp
        className={cn(sectionVariants({ spacing, background }), className)}
        ref={ref}
        {...props}
      >
        <div className={cn(
          container === "default" && "container mx-auto px-6",
          container === "fluid" && "px-6",
          container === "narrow" && "container mx-auto px-6 max-w-4xl",
          container === "wide" && "container mx-auto px-6 max-w-7xl"
        )}>
          {props.children}
        </div>
      </Comp>
    )
  }
)
Section.displayName = "Section"

// Specialized section components
const HeroSection = React.forwardRef<HTMLElement, Omit<SectionProps, 'spacing' | 'container'>>(
  ({ className, ...props }, ref) => (
    <Section
      ref={ref}
      spacing="lg"
      container="wide"
      className={cn("min-h-[75vh] flex items-center", className)}
      {...props}
    />
  )
)
HeroSection.displayName = "HeroSection"

const ContentSection = React.forwardRef<HTMLElement, Omit<SectionProps, 'spacing'>>(
  ({ className, ...props }, ref) => (
    <Section
      ref={ref}
      spacing="md"
      className={className}
      {...props}
    />
  )
)
ContentSection.displayName = "ContentSection"

const FeatureSection = React.forwardRef<HTMLElement, Omit<SectionProps, 'background' | 'container'>>(
  ({ className, ...props }, ref) => (
    <Section
      ref={ref}
      background="muted"
      container="wide"
      className={className}
      {...props}
    />
  )
)
FeatureSection.displayName = "FeatureSection"

export { 
  Section, 
  sectionVariants,
  HeroSection,
  ContentSection,
  FeatureSection
}