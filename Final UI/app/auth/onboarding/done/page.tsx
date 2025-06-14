"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, SparklesIcon, BuildingIcon, BriefcaseIcon, UsersIcon, StarIcon } from "lucide-react"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { useSearchParams, useRouter } from "next/navigation" // Added useRouter
import { useAuth } from "@/context/AuthContext"; // Added useAuth
import { toast } from "sonner"; // Added toast

export default function OnboardingDonePage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryUserType = searchParams.get('type');

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading user data...</div>;
  }

  // Prioritize userType from auth context once loaded
  const finalUserType = user?.user_type || queryUserType || 'individual'; // Default to 'individual' if absolutely nothing else

  if (!user && !queryUserType) {
    toast.error("User data not available. Redirecting to login.");
    if (typeof window !== 'undefined') {
        router.push('/auth/login');
    }
    return <div className="min-h-screen flex items-center justify-center">User data not available. Please try logging in again.</div>;
  }
  // The variable previously named 'userType' will now be 'finalUserType'

  const calculateProfileCompletion = (currentUser: any) => { // Using 'any' for user type for simplicity here
    if (!currentUser) return 0;
    let percentage = 20; // Base for signup

    if (currentUser.profile) {
      percentage += 30; // Profile step initiated
      if (currentUser.profile.bio) percentage += 5;
      if (currentUser.profile.location) percentage += 5;
      // Add more checks for key profile fields if desired
    }

    // Check for preferences data (assuming these fields are on user.profile after refetch)
    if (finalUserType === 'individual') {
      if (currentUser.profile?.job_status || currentUser.profile?.desired_roles?.length > 0) {
        percentage += 25;
      }
      // Check for culture data
      if (currentUser.profile?.ideal_next_job_description || currentUser.profile?.culture_preferences?.length > 0) {
        percentage += 20;
      }
    } else if (finalUserType === 'company') {
      if (currentUser.profile?.hiring_status || currentUser.profile?.hiring_roles?.length > 0) {
        percentage += 25;
      }
      // Companies don't have a separate 'culture' step in this flow, so max might be around 75-80 for them here.
    }

    return Math.min(percentage, 85); // Cap at a realistic pre-detailed-profile-completion max
  };

  const completionPercentage = user ? calculateProfileCompletion(user) : 0;

  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg mb-6">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-text-dark mb-3">
            {finalUserType === 'company' ? 'Company' : 'Professional'} Profile Setup Complete!
          </h1>
          <p className="text-brand-text-medium leading-relaxed">
            {finalUserType === 'company'
              ? "Great start! Your basic company profile is ready, but let's make it stand out with detailed information that will help you attract top talent."
              : "Great start! Your basic profile is ready, but let's make it stand out with detailed information that will help you find amazing opportunities."
            }
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-brand-text-dark">Profile Completion Status</h2>
            <span className="text-2xl font-bold text-black">{completionPercentage}%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {finalUserType === 'company' ? (
              <>
                <div className="flex items-center space-x-3">
                  {user?.profile ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />}
                  <span className={`text-sm font-medium ${user?.profile ? 'text-brand-text-dark' : 'text-gray-400'}`}>Company Information</span>
                </div>
                <div className="flex items-center space-x-3">
                  {user?.profile?.hiring_status ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />}
                  <span className={`text-sm font-medium ${user?.profile?.hiring_status ? 'text-brand-text-dark' : 'text-gray-400'}`}>Hiring Preferences</span>
                </div>
                {/* Company Culture section might be different or not part of this initial onboarding */}
                <div className="flex items-center space-x-3 opacity-50">
                  <div className="w-5 h-5 bg-gray-200 rounded-full" /> {/* Placeholder, not checked */}
                  <span className="text-sm text-gray-400 font-medium">Company Culture (Details)</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  {user?.profile ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />}
                  <span className={`text-sm font-medium ${user?.profile ? 'text-brand-text-dark' : 'text-gray-400'}`}>Personal Information</span>
                </div>
                <div className="flex items-center space-x-3">
                  {user?.profile?.job_status ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />}
                  <span className={`text-sm font-medium ${user?.profile?.job_status ? 'text-brand-text-dark' : 'text-gray-400'}`}>Job Preferences</span>
                </div>
                <div className="flex items-center space-x-3">
                  {user?.profile?.ideal_next_job_description ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />}
                  <span className={`text-sm font-medium ${user?.profile?.ideal_next_job_description ? 'text-brand-text-dark' : 'text-gray-400'}`}>Work Culture</span>
                </div>
              </>
            )}
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-3 bg-gradient-to-r from-black to-green-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* What's Missing */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-brand-text-dark mb-6 flex items-center">
            <SparklesIcon className="w-5 h-5 text-black mr-2" />
            {finalUserType === 'company'
              ? 'Complete Your Company Profile to Attract Top Talent'
              : 'Complete Your Professional Profile to Find Amazing Opportunities'
            }
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finalUserType === 'company' ? (
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
            {finalUserType === 'company' ? 'Ready to attract top talent?' : 'Ready to find your dream job?'}
          </h3>
          <p className="text-blue-100 mb-4">
            {finalUserType === 'company'
              ? 'Complete company profiles receive 5x more applications from qualified candidates.'
              : 'Complete profiles get 3x more interview invitations from top companies.'
            }
          </p>
          <Button
            className="w-full bg-black hover:bg-gray-900 text-white py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            asChild
          >
            <Link href={`/auth/onboarding/profile?type=${finalUserType}`}>
              <SparklesIcon className="w-6 h-6 mr-3" />
              {finalUserType === 'company' ? 'Complete Your Company Profile' : 'Complete Your Professional Profile'}
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
