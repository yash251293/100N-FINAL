"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import NextImage from "next/image" // Import NextImage

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", // Ensured relative and overflow-hidden for NextImage fill
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

// Define new props for AvatarImage, making alt required and adding priority
interface AvatarImageProps extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>, 'alt'> {
  alt: string;
  priority?: boolean;
  // src is already part of ComponentPropsWithoutRef and is optional there.
  // next/image needs src, so we handle the null case.
}

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarImageProps
>(({ className, src, alt, priority, ...props }, ref) => {
  // Ensure src and alt are provided, as they are required by NextImage
  // If not, return null to let AvatarFallback render.
  if (!src || !alt) {
    return null;
  }

  return (
    <AvatarPrimitive.Image
      ref={ref}
      asChild // Use asChild to delegate rendering to NextImage
      // className from props is merged with Radix's default for AvatarPrimitive.Image ("aspect-square h-full w-full")
      // This provides the container for NextImage with fill to work correctly.
      className={cn("aspect-square h-full w-full", className)}
      {...props} // Spread other Radix-specific props
    >
      <NextImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        // Adding 'object-cover' to ensure the image covers the area without distortion,
        // respecting the aspect ratio set by Radix's classes on AvatarPrimitive.Image.
        className="object-cover"
      />
    </AvatarPrimitive.Image>
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName // Keeping Radix display name

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
