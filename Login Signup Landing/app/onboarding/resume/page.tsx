"use client"

import { Button } from "@/components/ui/button"
import { UploadCloudIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { OnboardingStepper } from "@/components/onboarding-stepper"

export default function ResumePage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'individual'

  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-brand-text-dark mb-2">Upload a recent resume or CV</h1>
        <p className="text-brand-text-medium mb-8">
          Autocomplete your profile in just a few seconds by uploading a resume.
        </p>

        <div className="border-2 border-dashed border-brand-border rounded-lg p-10 sm:p-16 mb-6">
          <UploadCloudIcon className="mx-auto h-12 w-12 text-brand-text-light mb-4" />
          <p className="text-sm text-brand-text-medium mb-4">
            Click the button below to upload your resume as a .pdf, .doc, .docx, .rtf, .wp or .txt file
          </p>
          <Button className="bg-black hover:bg-gray-900 text-white font-medium">Upload Resume</Button>
        </div>

        <Button
          variant="outline"
          className="w-full sm:w-auto border-brand-border text-brand-text-medium hover:bg-brand-bg-light-gray font-medium"
          asChild
        >
          <Link href={`/onboarding/done?type=${userType}`}>Skip for now</Link>
        </Button>
      </div>
    </div>
  )
}
