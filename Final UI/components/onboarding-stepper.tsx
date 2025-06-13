"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CheckIcon, UserIcon, HeartIcon, SettingsIcon, FileTextIcon, SparklesIcon, BuildingIcon } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/context/AuthContext";

const individualSteps = [
  {
    name: "Verify Email",
    href: "/auth/onboarding/verify-email",
    shortName: "Email",
    icon: SparklesIcon,
    description: "Confirm your account"
  },
  {
    name: "Profile",
    href: "/auth/onboarding/profile",
    shortName: "Profile",
    icon: UserIcon,
    description: "Basic information"
  },
  {
    name: "Preferences",
    href: "/auth/onboarding/preferences",
    shortName: "Preferences",
    icon: SettingsIcon,
    description: "Job preferences"
  },
  {
    name: "Culture",
    href: "/auth/onboarding/culture",
    shortName: "Culture",
    icon: HeartIcon,
    description: "Work culture fit"
  },
  {
    name: "Resume/CV",
    href: "/auth/onboarding/resume",
    shortName: "Resume",
    icon: FileTextIcon,
    description: "Upload documents"
  },
  {
    name: "Complete",
    href: "/auth/onboarding/done",
    shortName: "Done",
    icon: CheckIcon,
    description: "All set!"
  },
]

const companySteps = [
  {
    name: "Verify Email",
    href: "/auth/onboarding/verify-email",
    shortName: "Email",
    icon: SparklesIcon,
    description: "Confirm your account"
  },
  {
    name: "Company Profile",
    href: "/auth/onboarding/profile",
    shortName: "Profile",
    icon: BuildingIcon,
    description: "Company information"
  },
  {
    name: "Preferences",
    href: "/auth/onboarding/preferences",
    shortName: "Preferences",
    icon: SettingsIcon,
    description: "Hiring preferences"
  },
  {
    name: "Complete",
    href: "/auth/onboarding/done",
    shortName: "Done",
    icon: CheckIcon,
    description: "All set!"
  },
]

export function OnboardingStepper() {
  const pathname = usePathname()
  const { user, isLoading: isAuthLoading } = useAuth();
  const userType = user?.user_type;

  if (isAuthLoading) {
    return <div>Loading authentication details...</div>; // Or a skeleton loader
  }

  if (!userType) {
    // This case should ideally not happen if onboarding is protected and user is always loaded.
    // Redirecting or showing an error might be appropriate.
    // For now, can show a message or return null to prevent errors.
    console.warn("OnboardingStepper: userType is undefined. User may not be properly loaded or authenticated.");
    return <div>Error: User type not determined. Please ensure you are logged in.</div>; // Or redirect
  }

  const stepsData = userType === 'company' ? companySteps : individualSteps
  const currentStepIndex = stepsData.findIndex((step) => pathname.startsWith(step.href))

  // For this example, let's assume email is verified if we are past the verify-email step or on it.
  // In a real app, this would come from user state.
  const emailVerified = currentStepIndex >= 0

  // Calculate progress percentage
  const completedSteps = currentStepIndex >= 0 ? currentStepIndex + 1 : 0
  const progressPercentage = (completedSteps / stepsData.length) * 100

  return (
    <div className="w-full max-w-3xl mx-auto px-4 mb-12">
      {/* Minimal Progress Bar with Dots */}
      <div className="relative flex items-center justify-between mb-2">
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />
        {stepsData.map((step, idx) => {
          let status = "upcoming"
          if (currentStepIndex > idx) {
            status = "complete"
          } else if (currentStepIndex === idx) {
            status = "current"
          }
          return (
            <div key={step.name} className="flex-1 flex flex-col items-center">
              <Link
                href={step.href}
                className={cn(
                  "relative z-10 flex flex-col items-center group",
                  "focus:outline-none"
                )}
                aria-current={status === "current" ? "step" : undefined}
              >
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-full border-2 transition-all duration-200",
                  status === "complete"
                    ? "bg-black border-black text-white"
                    : status === "current"
                      ? "bg-white border-black text-black"
                      : "bg-white border-gray-300 text-gray-400"
                )}>
                  <span className={cn(
                    "font-bold text-base",
                    status === "current" ? "text-black" : status === "complete" ? "text-white" : "text-gray-400"
                  )}>{idx + 1}</span>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
      {/* Step Names */}
      <div className="flex mt-1">
        {stepsData.map((step, idx) => (
          <div key={step.name} className="flex-1 flex flex-col items-center">
            <span
              className={cn(
                "text-xs font-medium text-center",
                idx === currentStepIndex ? "text-black" : "text-gray-400"
              )}
            >
              {step.shortName}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
