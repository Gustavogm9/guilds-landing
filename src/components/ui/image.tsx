import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const imageVariants = cva(
  "transition-all duration-300",
  {
    variants: {
      aspect: {
        square: "aspect-square",
        video: "aspect-video", 
        portrait: "aspect-[3/4]",
        auto: "aspect-auto",
      },
      fit: {
        cover: "object-cover",
        contain: "object-contain",
        fill: "object-fill",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        md: "rounded-md", 
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
      loading: {
        lazy: "",
        eager: "",
      }
    },
    defaultVariants: {
      aspect: "auto",
      fit: "cover",
      rounded: "md",
      loading: "lazy",
    },
  }
)

export interface ImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof imageVariants> {
  fallback?: string
}

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, aspect, fit, rounded, loading, fallback, onError, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false)
    
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setHasError(true)
      if (fallback) {
        e.currentTarget.src = fallback
      }
      onError?.(e)
    }

    return (
      <img
        className={cn(
          imageVariants({ aspect, fit, rounded }),
          hasError && "opacity-75",
          className
        )}
        loading={loading === "lazy" ? "lazy" : "eager"}
        onError={handleError}
        ref={ref}
        {...props}
      />
    )
  }
)
Image.displayName = "Image"

// Specialized image components
const HeroImage = React.forwardRef<HTMLImageElement, Omit<ImageProps, 'aspect' | 'fit'>>(
  ({ className, ...props }, ref) => (
    <Image
      ref={ref}
      aspect="video"
      fit="cover"
      rounded="xl"
      className={cn("w-full h-auto shadow-lg", className)}
      {...props}
    />
  )
)
HeroImage.displayName = "HeroImage"

const Avatar = React.forwardRef<HTMLImageElement, Omit<ImageProps, 'aspect' | 'rounded'>>(
  ({ className, ...props }, ref) => (
    <Image
      ref={ref}
      aspect="square"
      rounded="full"
      className={cn("w-12 h-12", className)}
      {...props}
    />
  )
)
Avatar.displayName = "Avatar"

const LogoImage = React.forwardRef<HTMLImageElement, Omit<ImageProps, 'fit' | 'aspect'>>(
  ({ className, ...props }, ref) => (
    <Image
      ref={ref}
      fit="contain"
      aspect="auto"
      className={cn("h-8 w-auto", className)}
      {...props}
    />
  )
)
LogoImage.displayName = "LogoImage"

export { 
  Image, 
  imageVariants,
  HeroImage,
  Avatar,
  LogoImage
}