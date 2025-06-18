"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { XIcon, CheckIcon, DollarSignIcon, BriefcaseIcon, MapPinIcon, BuildingIcon, UsersIcon, UserIcon, TargetIcon } from "lucide-react"
import Link from "next/link"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { useSearchParams } from "next/navigation"

interface ToggleButtonProps {
  value: string
  selectedValue: string
  onSelect: (value: string) => void
  children: React.ReactNode
  className?: string
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ value, selectedValue, onSelect, children, className }) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    className={cn(
      "px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200",
      selectedValue === value
        ? "bg-black text-white border-black shadow-md"
        : "bg-white text-brand-text-dark border-brand-border hover:border-gray-400 hover:shadow-sm",
      className
    )}
  >
    {children}
  </button>
)

export default function PreferencesPage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'company'
  
  // Company preferences
  const [hiringStatus, setHiringStatus] = useState("actively-hiring")
  const [employmentType, setEmploymentType] = useState("full-time")
  const [roles, setRoles] = useState<string[]>(["Software Engineering"])
  const [locations, setLocations] = useState<string[]>(["Noida"])
  
  // Individual preferences
  const [jobStatus, setJobStatus] = useState("actively-looking")
  const [desiredRoles, setDesiredRoles] = useState<string[]>(["Software Engineering"])
  const [workArrangement, setWorkArrangement] = useState("hybrid")
  const [experienceLevel, setExperienceLevel] = useState("mid-level")
  const [salaryExpectation, setSalaryExpectation] = useState({ min: "", max: "", currency: "usd" })
  const [careerGoals, setCareerGoals] = useState<string[]>([])

  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text-dark mb-3">
            {userType === 'company' 
              ? 'What are you looking to hire?' 
              : 'What are your job preferences?'
            }
          </h1>
          <p className="text-brand-text-medium leading-relaxed">
            {userType === 'company'
              ? 'Help us understand your hiring needs to match you with the perfect candidates.'
              : 'Tell us about your career goals and preferences to find the perfect opportunities.'
            }
          </p>
        </div>
        
        <form className="space-y-10">
          {userType === 'company' ? (
            // Company Preferences
            <>
              {/* Hiring Status */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <BuildingIcon className="h-5 w-5 text-black" />
                  <Label className="text-base font-semibold text-brand-text-dark">
                    What's your current hiring status? <span className="text-brand-red">*</span>
                  </Label>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      value: "actively-hiring",
                      label: "Actively Hiring",
                      desc: "We have open positions and are actively interviewing candidates.",
                    },
                    {
                      value: "planning-to-hire",
                      label: "Planning to Hire",
                      desc: "We'll be hiring soon and want to start building our talent pipeline.",
                    },
                    {
                      value: "not-hiring",
                      label: "Not Hiring Right Now",
                      desc: "We're not currently hiring but want to keep our company profile active.",
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setHiringStatus(item.value)}
                      className={cn(
                        "p-5 border rounded-xl text-left transition-all duration-200",
                        hiringStatus === item.value
                          ? "border-black ring-2 ring-black/20 bg-gray-50 shadow-md"
                          : "border-brand-border hover:border-gray-400 bg-white hover:shadow-sm",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-semibold text-brand-text-dark block mb-1">{item.label}</span>
                          <p className="text-sm text-brand-text-medium leading-relaxed">{item.desc}</p>
                        </div>
                        {hiringStatus === item.value && (
                          <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Employment Type */}
              <div className="space-y-4">
                <Label className="block text-base font-semibold text-brand-text-dark">
                  What type of employment are you offering? <span className="text-brand-red">*</span>
                </Label>
                <p className="text-sm text-brand-text-medium">
                  Select the employment types you're currently hiring for.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "full-time", label: "Full-time Position" },
                    { id: "part-time", label: "Part-time Position" },
                    { id: "contract", label: "Contract Work" },
                    { id: "freelance", label: "Freelance Projects" },
                    { id: "intern", label: "Internship" }
                  ].map((type) => (
                    <ToggleButton
                      key={type.id}
                      value={type.id}
                      selectedValue={employmentType}
                      onSelect={setEmploymentType}
                    >
                      {type.label}
                    </ToggleButton>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSignIcon className="h-5 w-5 text-black" />
                  <Label htmlFor="salary" className="text-base font-semibold text-brand-text-dark">
                    What's your salary range for these positions?
                  </Label>
                </div>
                <p className="text-sm text-brand-text-medium bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <strong>Note:</strong> This helps us match you with candidates in your budget range
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-light" />
                    <Input
                      id="minSalary"
                      type="number"
                      placeholder="Min salary"
                      className="bg-brand-bg-input border-brand-border pl-9 focus:border-black focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-light" />
                    <Input
                      id="maxSalary"
                      type="number"
                      placeholder="Max salary"
                      className="bg-brand-bg-input border-brand-border pl-9 focus:border-black focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>
                <Select defaultValue="usd">
                  <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="inr">INR (₹)</SelectItem>
                    <SelectItem value="cad">CAD ($)</SelectItem>
                    <SelectItem value="aud">AUD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Roles Hiring For */}
              <div className="space-y-4">
                <Label className="block text-base font-semibold text-brand-text-dark">
                  Which roles are you hiring for?
                </Label>
                <p className="text-sm text-brand-text-medium">
                  Select all roles you're currently hiring for. We'll match you with relevant candidates.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center bg-black text-white text-sm font-medium px-4 py-2 rounded-full"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => setRoles((r) => r.filter((item) => item !== role))}
                        className="ml-2 text-white hover:bg-gray-900 rounded-full p-0.5 transition-colors"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select onValueChange={(newRole) => !roles.includes(newRole) && setRoles((r) => [...r, newRole])}>
                  <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20">
                    <SelectValue placeholder="Add a role you're hiring for" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                    <SelectItem value="Product Management">Product Management</SelectItem>
                    <SelectItem value="Design & UX">Design & UX</SelectItem>
                    <SelectItem value="Data Science">Data Science & Analytics</SelectItem>
                    <SelectItem value="Marketing">Marketing & Growth</SelectItem>
                    <SelectItem value="Sales">Sales & Business Development</SelectItem>
                    <SelectItem value="Operations">Operations & Strategy</SelectItem>
                    <SelectItem value="Finance">Finance & Accounting</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Customer Success">Customer Success</SelectItem>
                    <SelectItem value="DevOps">DevOps & Infrastructure</SelectItem>
                    <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Work Locations */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPinIcon className="h-5 w-5 text-black" />
                  <Label className="block text-base font-semibold text-brand-text-dark">
                    Where are these positions located?
                  </Label>
                </div>
                <p className="text-sm text-brand-text-medium">
                  Add all locations where you're hiring. Include remote if you offer it.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {locations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => setLocations((l) => l.filter((item) => item !== location))}
                        className="ml-2 text-gray-600 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select onValueChange={(newLocation) => !locations.includes(newLocation) && setLocations((l) => [...l, newLocation])}>
                  <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20">
                    <SelectValue placeholder="Add a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">🌍 Remote</SelectItem>
                    <SelectItem value="Hybrid">🏢 Hybrid</SelectItem>
                    <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                    <SelectItem value="New York, NY">New York, NY</SelectItem>
                    <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                    <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                    <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                    <SelectItem value="Boston, MA">Boston, MA</SelectItem>
                    <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                    <SelectItem value="Denver, CO">Denver, CO</SelectItem>
                    <SelectItem value="Miami, FL">Miami, FL</SelectItem>
                    <SelectItem value="London, UK">London, UK</SelectItem>
                    <SelectItem value="Berlin, Germany">Berlin, Germany</SelectItem>
                    <SelectItem value="Toronto, Canada">Toronto, Canada</SelectItem>
                    <SelectItem value="Bangalore, India">Bangalore, India</SelectItem>
                    <SelectItem value="Mumbai, India">Mumbai, India</SelectItem>
                    <SelectItem value="Delhi, India">Delhi, India</SelectItem>
                    <SelectItem value="Noida, India">Noida, India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            // Individual Preferences
            <>
              {/* Job Search Status */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <UserIcon className="h-5 w-5 text-black" />
                  <Label className="text-base font-semibold text-brand-text-dark">
                    What's your current job search status? <span className="text-brand-red">*</span>
                  </Label>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    {
                      value: "actively-looking",
                      label: "Actively Looking",
                      desc: "I'm actively applying and interviewing for new opportunities.",
                    },
                    {
                      value: "open-to-opportunities",
                      label: "Open to Opportunities",
                      desc: "I'm not actively searching but open to the right opportunity.",
                    },
                    {
                      value: "exploring",
                      label: "Just Exploring",
                      desc: "I'm researching and exploring what's available in the market.",
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setJobStatus(item.value)}
                      className={cn(
                        "p-5 border rounded-xl text-left transition-all duration-200",
                        jobStatus === item.value
                          ? "border-black ring-2 ring-black/20 bg-gray-50 shadow-md"
                          : "border-brand-border hover:border-gray-400 bg-white hover:shadow-sm",
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-semibold text-brand-text-dark block mb-1">{item.label}</span>
                          <p className="text-sm text-brand-text-medium leading-relaxed">{item.desc}</p>
                        </div>
                        {jobStatus === item.value && (
                          <CheckIcon className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Desired Roles */}
              <div className="space-y-4">
                <Label className="block text-base font-semibold text-brand-text-dark">
                  What type of roles are you interested in? <span className="text-brand-red">*</span>
                </Label>
                <p className="text-sm text-brand-text-medium">
                  Select all the roles you'd be interested in applying for.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {desiredRoles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center bg-black text-white text-sm font-medium px-4 py-2 rounded-full"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => setDesiredRoles((r) => r.filter((item) => item !== role))}
                        className="ml-2 text-white hover:bg-gray-900 rounded-full p-0.5 transition-colors"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select onValueChange={(newRole) => !desiredRoles.includes(newRole) && setDesiredRoles((r) => [...r, newRole])}>
                  <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20">
                    <SelectValue placeholder="Add a role you're interested in" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                    <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                    <SelectItem value="Full Stack Development">Full Stack Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="DevOps Engineering">DevOps Engineering</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                    <SelectItem value="Product Management">Product Management</SelectItem>
                    <SelectItem value="UX Design">UX Design</SelectItem>
                    <SelectItem value="UI Design">UI Design</SelectItem>
                    <SelectItem value="Product Design">Product Design</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Business Development">Business Development</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Customer Success">Customer Success</SelectItem>
                    <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Work Arrangement */}
              <div className="space-y-4">
                <Label className="block text-base font-semibold text-brand-text-dark">
                  What's your preferred work arrangement? <span className="text-brand-red">*</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "remote", label: "Remote Only" },
                    { id: "hybrid", label: "Hybrid (2-3 days office)" },
                    { id: "in-office", label: "In-Office" },
                    { id: "flexible", label: "Flexible/Open to All" }
                  ].map((arrangement) => (
                    <ToggleButton
                      key={arrangement.id}
                      value={arrangement.id}
                      selectedValue={workArrangement}
                      onSelect={setWorkArrangement}
                    >
                      {arrangement.label}
                    </ToggleButton>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="space-y-4">
                <Label className="block text-base font-semibold text-brand-text-dark">
                  What level of positions are you targeting? <span className="text-brand-red">*</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "entry-level", label: "Entry Level (0-2 years)" },
                    { id: "mid-level", label: "Mid Level (3-5 years)" },
                    { id: "senior-level", label: "Senior Level (6-8 years)" },
                    { id: "lead-level", label: "Lead Level (9+ years)" },
                    { id: "executive", label: "Executive/C-Level" }
                  ].map((level) => (
                    <ToggleButton
                      key={level.id}
                      value={level.id}
                      selectedValue={experienceLevel}
                      onSelect={setExperienceLevel}
                    >
                      {level.label}
                    </ToggleButton>
                  ))}
                </div>
              </div>

              {/* Salary Expectations */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSignIcon className="h-5 w-5 text-black" />
                  <Label className="text-base font-semibold text-brand-text-dark">
                    What are your salary expectations?
                  </Label>
                </div>
                <p className="text-sm text-brand-text-medium bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <strong>💡 Tip:</strong> Being transparent about salary helps match you with roles in your desired range
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-light" />
                    <Input
                      type="number"
                      placeholder="Min expected"
                      value={salaryExpectation.min}
                      onChange={(e) => setSalaryExpectation(prev => ({ ...prev, min: e.target.value }))}
                      className="bg-brand-bg-input border-brand-border pl-9 focus:border-black focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                  <div className="relative">
                    <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-light" />
                    <Input
                      type="number"
                      placeholder="Max expected"
                      value={salaryExpectation.max}
                      onChange={(e) => setSalaryExpectation(prev => ({ ...prev, max: e.target.value }))}
                      className="bg-brand-bg-input border-brand-border pl-9 focus:border-black focus:ring-2 focus:ring-black/20"
                    />
                  </div>
                </div>
                <Select value={salaryExpectation.currency} onValueChange={(currency) => setSalaryExpectation(prev => ({ ...prev, currency }))}>
                  <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($) - Annual</SelectItem>
                    <SelectItem value="eur">EUR (€) - Annual</SelectItem>
                    <SelectItem value="gbp">GBP (£) - Annual</SelectItem>
                    <SelectItem value="inr">INR (₹) - Annual</SelectItem>
                    <SelectItem value="cad">CAD ($) - Annual</SelectItem>
                    <SelectItem value="aud">AUD ($) - Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Career Goals */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TargetIcon className="h-5 w-5 text-black" />
                  <Label className="block text-base font-semibold text-brand-text-dark">
                    What are your career goals?
                  </Label>
                </div>
                <p className="text-sm text-brand-text-medium">
                  Select what matters most to you in your next role.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Career Growth",
                    "Work-Life Balance",
                    "High Compensation",
                    "Learning New Technologies",
                    "Leadership Opportunities",
                    "Startup Environment",
                    "Established Company",
                    "Remote Work",
                    "Impactful Work",
                    "Team Collaboration",
                    "Innovation & Creativity",
                    "Job Security"
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => {
                        if (careerGoals.includes(goal)) {
                          setCareerGoals(prev => prev.filter(g => g !== goal))
                        } else {
                          setCareerGoals(prev => [...prev, goal])
                        }
                      }}
                      className={cn(
                        "p-3 text-sm font-medium rounded-lg border transition-all duration-200 text-left",
                        careerGoals.includes(goal)
                          ? "bg-black text-white border-black"
                          : "bg-white text-brand-text-dark border-brand-border hover:border-gray-400"
                      )}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Locations */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPinIcon className="h-5 w-5 text-black" />
                  <Label className="block text-base font-semibold text-brand-text-dark">
                    Where are you open to working?
                  </Label>
                </div>
                <p className="text-sm text-brand-text-medium">
                  Select all locations you're willing to work in or relocate to.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {locations.map((location) => (
                    <span
                      key={location}
                      className="inline-flex items-center bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-full"
                    >
                      {location}
                      <button
                        type="button"
                        onClick={() => setLocations((l) => l.filter((item) => item !== location))}
                        className="ml-2 text-gray-600 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <Select onValueChange={(newLocation) => !locations.includes(newLocation) && setLocations((l) => [...l, newLocation])}>
                  <SelectTrigger className="w-full bg-brand-bg-input border-brand-border focus:border-black focus:ring-2 focus:ring-black/20">
                    <SelectValue placeholder="Add a preferred location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Remote">🌍 Remote (Anywhere)</SelectItem>
                    <SelectItem value="San Francisco, CA">San Francisco, CA</SelectItem>
                    <SelectItem value="New York, NY">New York, NY</SelectItem>
                    <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                    <SelectItem value="Seattle, WA">Seattle, WA</SelectItem>
                    <SelectItem value="Austin, TX">Austin, TX</SelectItem>
                    <SelectItem value="Boston, MA">Boston, MA</SelectItem>
                    <SelectItem value="Chicago, IL">Chicago, IL</SelectItem>
                    <SelectItem value="Denver, CO">Denver, CO</SelectItem>
                    <SelectItem value="Miami, FL">Miami, FL</SelectItem>
                    <SelectItem value="London, UK">London, UK</SelectItem>
                    <SelectItem value="Berlin, Germany">Berlin, Germany</SelectItem>
                    <SelectItem value="Toronto, Canada">Toronto, Canada</SelectItem>
                    <SelectItem value="Bangalore, India">Bangalore, India</SelectItem>
                    <SelectItem value="Mumbai, India">Mumbai, India</SelectItem>
                    <SelectItem value="Delhi, India">Delhi, India</SelectItem>
                    <SelectItem value="Noida, India">Noida, India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-3 font-medium text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              asChild
            >
              <Link href={userType === 'individual' ? `/onboarding/culture?type=${userType}` : `/onboarding/done?type=${userType}`}>
                Continue {userType === 'individual' ? 'to Culture Fit →' : 'to Complete Setup →'}
              </Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
