"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, SparklesIcon, BuildingIcon, BriefcaseIcon, UsersIcon, StarIcon } from "lucide-react"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { useSearchParams } from "next/navigation"

export default function OnboardingDonePage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'company'

  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text-dark mb-3">
            {userType === 'company' ? 'Company' : 'Professional'} Profile Setup Complete!
          </h1>
          <p className="text-brand-text-medium leading-relaxed">
            {userType === 'company'
              ? "Great start! Your basic company profile is ready, but let's make it stand out with detailed information that will help you attract top talent."
              : "Great start! Your basic profile is ready, but let's make it stand out with detailed information that will help you find amazing opportunities."
            }
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-text-dark">Profile Completion Status</h2>
            <span className="text-2xl font-bold text-black">35%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {userType === 'company' ? (
              <>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-brand-text-dark font-medium">Company Information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-brand-text-dark font-medium">Hiring Preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-brand-text-dark font-medium">Company Culture</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-brand-text-dark font-medium">Personal Information</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-brand-text-dark font-medium">Job Preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-brand-text-dark font-medium">Work Culture</span>
                </div>
              </>
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-black to-green-500 rounded-full transition-all duration-700 ease-out w-[35%]" />
          </div>
        </div>

        {/* What's Missing */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-brand-text-dark mb-6 flex items-center">
            <SparklesIcon className="w-5 h-5 text-black mr-2" />
            {userType === 'company'
              ? 'Complete Your Company Profile to Attract Top Talent'
              : 'Complete Your Professional Profile to Find Amazing Opportunities'
            }
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userType === 'company' ? (
              <>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <BuildingIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Company Overview</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">Add your company's mission, vision, and values</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Open Positions</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">List your current job openings and requirements</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <UsersIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Team & Culture</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">Showcase your team and company culture</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <StarIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Benefits & Perks</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">Highlight your employee benefits and perks</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Work Experience</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">Add your professional experience and achievements</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <StarIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Skills & Education</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">Showcase your skills and educational background</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <UsersIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Professional Bio</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">Tell your professional story and aspirations</p>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3 mb-2">
                    <BuildingIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-brand-text-dark">Portfolio & Projects</span>
                  </div>
                  <p className="text-sm text-brand-text-medium">Display your best work and projects</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-black to-gray-800 p-6 rounded-xl text-white text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">
            {userType === 'company' ? 'Ready to attract top talent?' : 'Ready to find your dream job?'}
          </h3>
          <p className="text-blue-100 mb-4">
            {userType === 'company'
              ? 'Complete company profiles receive 5x more applications from qualified candidates.'
              : 'Complete profiles get 3x more interview invitations from top companies.'
            }
          </p>
          <Button
            className="w-full bg-black hover:bg-gray-900 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            asChild
          >
            <Link href={`/auth/onboarding/profile?type=${userType}`}>
              <SparklesIcon className="w-6 h-6 mr-3" />
              {userType === 'company' ? 'Complete Your Company Profile' : 'Complete Your Professional Profile'}
            </Link>
          </Button>
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <Button
            variant="outline"
            className="border-brand-border text-brand-text-medium hover:bg-brand-bg-light-gray font-medium"
            asChild
          >
            <Link href="/feed">Skip for now, go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
