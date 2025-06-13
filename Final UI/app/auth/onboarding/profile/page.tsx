"use client" // For form handling state

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SearchIcon, XIcon, MapPinIcon, BuildingIcon, LinkIcon, BriefcaseIcon, UsersIcon, UserIcon, GraduationCapIcon } from "lucide-react"
import Link from "next/link"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { useSearchParams } from "next/navigation"

export default function ProfilePage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'company'
  const [location, setLocation] = useState("Noida, Uttar Pradesh")
  const [searchLocation, setSearchLocation] = useState("")

  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-lg mb-4">
            {userType === 'company' ? (
              <BuildingIcon className="w-8 h-8 text-white" />
            ) : (
              <UserIcon className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-brand-text-dark mb-3">
            {userType === 'company'
              ? 'Tell us about your company'
              : 'Tell us about yourself'
            }
          </h1>
          <p className="text-brand-text-medium leading-relaxed">
            {userType === 'company'
              ? 'Share your company details to help us connect you with the right talent and opportunities.'
              : 'Share your professional details to help us match you with amazing opportunities and connections.'
            }
          </p>
        </div>

        <form className="space-y-10">
          {/* Location Section */}
          <div className="space-y-5">
            <div className="flex items-center space-x-2 mb-3">
              <MapPinIcon className="h-5 w-5 text-black" />
              <Label htmlFor="location" className="text-base font-semibold text-brand-text-dark">
                {userType === 'company'
                  ? 'Where is your company headquartered?'
                  : 'Where are you located?'
                } <span className="text-brand-red">*</span>
              </Label>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700">
                <strong>💡 Location Benefits:</strong> {userType === 'company'
                  ? 'Your company location helps us match you with local talent and understand your regional market presence.'
                  : 'Your location helps us find relevant job opportunities and connect you with companies in your area.'
                }
              </p>
            </div>

            {location && (
              <div className="animate-in slide-in-from-left duration-300">
                <div className="inline-flex items-center bg-gradient-to-r from-black to-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-md">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {location}
                  <button
                    type="button"
                    onClick={() => setLocation("")}
                    className="ml-2 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                id="searchLocation"
                type="text"
                placeholder="Search for a city, state, or country"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-black focus:ring-2 focus:ring-black/20 pl-10"
              />
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-light" />
            </div>
          </div>

          {userType === 'company' ? (
            // Company Profile Sections
            <>
              {/* Company Details Section */}
              <div className="border-t border-brand-border pt-8 space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <BuildingIcon className="h-5 w-5 text-black" />
                  <h2 className="text-xl font-semibold text-brand-text-dark">Company Information</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="companyType" className="block text-base font-semibold text-brand-text-dark mb-3">
                      What type of company are you? <span className="text-brand-red">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12">
                        <SelectValue placeholder="Select company type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startup">🚀 Startup</SelectItem>
                        <SelectItem value="enterprise">🏢 Enterprise</SelectItem>
                        <SelectItem value="agency">🎯 Agency</SelectItem>
                        <SelectItem value="nonprofit">💝 Non-Profit</SelectItem>
                        <SelectItem value="government">🏛️ Government</SelectItem>
                        <SelectItem value="other">🔧 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="companySize" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Company Size <span className="text-brand-red">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">👥 1-10 employees</SelectItem>
                        <SelectItem value="11-50">👥 11-50 employees</SelectItem>
                        <SelectItem value="51-200">👥 51-200 employees</SelectItem>
                        <SelectItem value="201-500">👥 201-500 employees</SelectItem>
                        <SelectItem value="501-1000">👥 501-1000 employees</SelectItem>
                        <SelectItem value="1000+">👥 1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="companyDescription" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Company Description <span className="text-brand-red">*</span>
                    </Label>
                    <p className="text-sm text-brand-text-medium mb-4">
                      Tell us about your company's mission, values, and what makes you unique.
                    </p>
                    <Textarea
                      id="companyDescription"
                      placeholder="Describe your company..."
                      className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 min-h-[120px]"
                    />
                  </div>
                </div>
              </div>

              {/* Industry & Focus Section */}
              <div className="border-t border-brand-border pt-8 space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <BriefcaseIcon className="h-5 w-5 text-black" />
                  <h2 className="text-xl font-semibold text-brand-text-dark">Industry & Focus</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="industry" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Primary Industry <span className="text-brand-red">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">💻 Technology</SelectItem>
                        <SelectItem value="finance">💰 Finance</SelectItem>
                        <SelectItem value="healthcare">🏥 Healthcare</SelectItem>
                        <SelectItem value="education">📚 Education</SelectItem>
                        <SelectItem value="retail">🛍️ Retail</SelectItem>
                        <SelectItem value="manufacturing">🏭 Manufacturing</SelectItem>
                        <SelectItem value="other">🔧 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="techStack" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Tech Stack (if applicable)
                    </Label>
                    <p className="text-sm text-brand-text-medium mb-4">
                      List the main technologies your company uses. This helps us match you with relevant talent.
                    </p>
                    <Input
                      id="techStack"
                      placeholder="e.g., React, Node.js, Python, AWS"
                      className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Company Links Section */}
              <div className="border-t border-brand-border pt-8 space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <LinkIcon className="h-5 w-5 text-black" />
                  <h2 className="text-xl font-semibold text-brand-text-dark">Company Presence</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="website" className="block text-base font-semibold text-brand-text-dark mb-2">
                      Company Website
                    </Label>
                    <Input
                      id="website"
                      placeholder="https://yourcompany.com"
                      className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin" className="block text-base font-semibold text-brand-text-dark mb-2">
                      LinkedIn Company Page
                    </Label>
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/company/yourcompany"
                      className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Individual Profile Sections
            <>
              {/* Personal Information Section */}
              <div className="border-t border-brand-border pt-8 space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <UserIcon className="h-5 w-5 text-black" />
                  <h2 className="text-xl font-semibold text-brand-text-dark">Personal Information</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="block text-base font-semibold text-brand-text-dark mb-3">
                        First Name <span className="text-brand-red">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="e.g. John"
                        className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="block text-base font-semibold text-brand-text-dark mb-3">
                        Last Name <span className="text-brand-red">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="e.g. Doe"
                        className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="professionalTitle" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Professional Title <span className="text-brand-red">*</span>
                    </Label>
                    <Input
                      id="professionalTitle"
                      placeholder="e.g. Senior Software Engineer, Product Designer, Marketing Manager"
                      className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearsOfExperience" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Years of Professional Experience <span className="text-brand-red">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12">
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">🌱 0-1 years (Entry Level)</SelectItem>
                        <SelectItem value="2-3">📈 2-3 years (Junior)</SelectItem>
                        <SelectItem value="4-6">💼 4-6 years (Mid-Level)</SelectItem>
                        <SelectItem value="7-10">🚀 7-10 years (Senior)</SelectItem>
                        <SelectItem value="10+">⭐ 10+ years (Expert/Lead)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Professional Background Section */}
              <div className="border-t border-brand-border pt-8 space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <BriefcaseIcon className="h-5 w-5 text-black" />
                  <h2 className="text-xl font-semibold text-brand-text-dark">Professional Background</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="primaryIndustry" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Primary Industry <span className="text-brand-red">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12">
                        <SelectValue placeholder="Select your primary industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">💻 Technology</SelectItem>
                        <SelectItem value="finance">💰 Finance & Banking</SelectItem>
                        <SelectItem value="healthcare">🏥 Healthcare</SelectItem>
                        <SelectItem value="education">📚 Education</SelectItem>
                        <SelectItem value="retail">🛍️ Retail & E-commerce</SelectItem>
                        <SelectItem value="manufacturing">🏭 Manufacturing</SelectItem>
                        <SelectItem value="consulting">💡 Consulting</SelectItem>
                        <SelectItem value="media">📺 Media & Entertainment</SelectItem>
                        <SelectItem value="other">🔧 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="jobFunction" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Job Function <span className="text-brand-red">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12">
                        <SelectValue placeholder="Select your job function" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">⚙️ Engineering & Development</SelectItem>
                        <SelectItem value="design">🎨 Design & UX</SelectItem>
                        <SelectItem value="product">📱 Product Management</SelectItem>
                        <SelectItem value="marketing">📢 Marketing & Growth</SelectItem>
                        <SelectItem value="sales">💼 Sales & Business Development</SelectItem>
                        <SelectItem value="operations">📋 Operations & Strategy</SelectItem>
                        <SelectItem value="finance">💰 Finance & Accounting</SelectItem>
                        <SelectItem value="hr">👥 Human Resources</SelectItem>
                        <SelectItem value="other">🔧 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="keySkills" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Key Skills & Technologies
                    </Label>
                    <p className="text-sm text-brand-text-medium mb-4">
                      List your primary skills and technologies (we'll dive deeper later).
                    </p>
                    <Input
                      id="keySkills"
                      placeholder="e.g., JavaScript, React, Python, Data Analysis, Project Management"
                      className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="border-t border-brand-border pt-8 space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <GraduationCapIcon className="h-5 w-5 text-black" />
                  <h2 className="text-xl font-semibold text-brand-text-dark">Education</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="educationLevel" className="block text-base font-semibold text-brand-text-dark mb-3">
                      Highest Education Level <span className="text-brand-red">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12">
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high-school">🏫 High School</SelectItem>
                        <SelectItem value="associates">📜 Associate's Degree</SelectItem>
                        <SelectItem value="bachelors">🎓 Bachelor's Degree</SelectItem>
                        <SelectItem value="masters">🎖️ Master's Degree</SelectItem>
                        <SelectItem value="phd">👨‍🎓 PhD/Doctorate</SelectItem>
                        <SelectItem value="bootcamp">💻 Coding Bootcamp</SelectItem>
                        <SelectItem value="self-taught">📚 Self-Taught</SelectItem>
                        <SelectItem value="other">🔧 Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fieldOfStudy" className="block text-base font-semibold text-brand-text-dark mb-3">
                        Field of Study
                      </Label>
                      <Input
                        id="fieldOfStudy"
                        placeholder="e.g. Computer Science, Business Administration"
                        className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                      />
                    </div>
                    <div>
                      <Label htmlFor="institution" className="block text-base font-semibold text-brand-text-dark mb-3">
                        Institution
                      </Label>
                      <Input
                        id="institution"
                        placeholder="e.g. Stanford University, General Assembly"
                        className="bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20 h-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-3 font-medium text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              asChild
            >
              <Link href={`/auth/onboarding/preferences?type=${userType}`}>Continue to Preferences →</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
