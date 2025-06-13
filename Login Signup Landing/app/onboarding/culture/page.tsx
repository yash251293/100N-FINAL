"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { CheckCircle, HeartIcon, UsersIcon, BrainCircuitIcon } from "lucide-react"
import Link from "next/link"
import { OnboardingStepper } from "@/components/onboarding-stepper"
import { useSearchParams } from "next/navigation"

interface ToggleChipProps {
  id: string
  label: string
  isSelected: boolean
  onToggle: (id: string) => void
}

const ToggleChip: React.FC<ToggleChipProps> = ({ id, label, isSelected, onToggle }) => (
  <button
    type="button"
    onClick={() => onToggle(id)}
    className={cn(
      "px-4 py-2.5 text-sm border rounded-full transition-all duration-200 flex items-center font-medium",
      isSelected
        ? "bg-black text-white border-black shadow-md scale-105"
        : "bg-white text-brand-text-medium border-brand-border hover:border-black hover:text-black hover:shadow-sm",
    )}
  >
    {isSelected && <CheckCircle className="w-4 h-4 mr-2" />}
    {label}
  </button>
)

interface ImportanceButtonGroupProps {
  selectedValue: string
  onSelect: (value: string) => void
}

const ImportanceButtonGroup: React.FC<ImportanceButtonGroupProps> = ({ selectedValue, onSelect }) => (
  <div className="grid grid-cols-3 gap-3">
    {[
      { value: "Very important", color: "green", label: "Very Important" },
      { value: "Important", color: "yellow", label: "Somewhat Important" },
      { value: "Not important", color: "gray", label: "Not Important" }
    ].map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onSelect(option.value)}
        className={cn(
          "px-4 py-3 text-sm font-medium border rounded-lg transition-all duration-200 text-center",
          selectedValue === option.value
            ? option.color === "green"
              ? "bg-green-100 text-green-700 border-green-300 shadow-md"
              : option.color === "yellow"
              ? "bg-yellow-100 text-yellow-700 border-yellow-300 shadow-md"
              : "bg-gray-100 text-gray-700 border-gray-300 shadow-md"
            : "bg-white text-brand-text-medium border-brand-border hover:border-gray-400 hover:shadow-sm",
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
)

export default function CulturePage() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'individual'
  
  const culturePrefsInitial = [
    { id: "say-in-work", label: "Having autonomy in how I work", selected: true },
    { id: "growth-opportunities", label: "Clear career advancement paths", selected: true },
    { id: "learn-from-team", label: "Working with experienced mentors", selected: false },
    { id: "good-trajectory", label: "Being part of a growing company", selected: false },
    { id: "say-in-direction", label: "Contributing to strategic decisions", selected: false },
    { id: "mentorship", label: "Access to mentorship programs", selected: false },
    { id: "learn-new-things", label: "Continuous learning opportunities", selected: true },
    { id: "challenging-problems", label: "Working on complex, meaningful problems", selected: true },
    { id: "diverse-team", label: "Collaborating with diverse perspectives", selected: false },
    { id: "work-life-balance", label: "Healthy work-life balance", selected: false },
    { id: "innovative-environment", label: "Innovative and creative environment", selected: false },
    { id: "social-impact", label: "Making a positive social impact", selected: false },
  ]
  const [culturePrefs, setCulturePrefs] = useState(culturePrefsInitial)
  const [remotePolicyImportance, setRemotePolicyImportance] = useState("Not important")
  const [quietOfficeImportance, setQuietOfficeImportance] = useState("Not important")
  const [nextJobDescription, setNextJobDescription] = useState("")

  const toggleCulturePref = (id: string) => {
    setCulturePrefs((prefs) => prefs.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text-dark mb-3">What motivates you at work?</h1>
          <p className="text-brand-text-medium leading-relaxed">
            Tell us about your ideal work environment and culture preferences to find companies that align with your values.
          </p>
        </div>
        
        <form className="space-y-10">
          <div className="space-y-5">
            <div className="flex items-center space-x-2 mb-4">
              <HeartIcon className="h-5 w-5 text-black" />
              <Label className="text-base font-semibold text-brand-text-dark">
                What are you looking for in your next role?
              </Label>
            </div>
            <p className="text-sm text-brand-text-medium mb-4">
              Select all the factors that are important to you. This helps us match you with companies that share your priorities.
            </p>
            <div className="flex flex-wrap gap-3">
              {culturePrefs.map((pref) => (
                <ToggleChip
                  key={pref.id}
                  id={pref.id}
                  label={pref.label}
                  isSelected={pref.selected}
                  onToggle={toggleCulturePref}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <UsersIcon className="h-5 w-5 text-black" />
              <Label className="text-base font-semibold text-brand-text-dark">
                How important is remote work flexibility to you?
              </Label>
            </div>
            <p className="text-sm text-brand-text-medium mb-3">
              This helps us understand your preferred work arrangement and match you accordingly.
            </p>
            <ImportanceButtonGroup selectedValue={remotePolicyImportance} onSelect={setRemotePolicyImportance} />
          </div>

          <div className="space-y-4">
            <Label className="block text-base font-semibold text-brand-text-dark">
              How important is having a quiet, focused work environment?
            </Label>
            <p className="text-sm text-brand-text-medium mb-3">
              Some people thrive in collaborative, bustling environments while others prefer quiet, focused spaces.
            </p>
            <ImportanceButtonGroup selectedValue={quietOfficeImportance} onSelect={setQuietOfficeImportance} />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <BrainCircuitIcon className="h-5 w-5 text-black" />
              <Label htmlFor="nextJobDescription" className="text-base font-semibold text-brand-text-dark">
                Describe your ideal next opportunity <span className="text-brand-red">*</span>
              </Label>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
              <p className="text-sm text-blue-700">
                <strong>💡 Tip:</strong> Recruiters and hiring managers read this first! Be specific about what excites you, 
                what impact you want to make, and what kind of environment helps you do your best work.
              </p>
            </div>
            <Textarea
              id="nextJobDescription"
              value={nextJobDescription}
              onChange={(e) => setNextJobDescription(e.target.value)}
              placeholder="I'm looking for a role where I can..."
              maxLength={300}
              className="bg-brand-bg-input border-brand-border min-h-[120px] focus:border-black focus:ring-2 focus:ring-black/20"
            />
            <div className="flex justify-between items-center text-xs">
              <p className="text-brand-text-medium">
                Be authentic and specific - this is your chance to stand out!
              </p>
              <p className={cn(
                "font-medium",
                nextJobDescription.length > 250 ? "text-amber-600" : "text-brand-text-light"
              )}>
                {nextJobDescription.length} / 300
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0" />
            <span>
              <strong>Almost there!</strong> Complete your profile and start connecting with companies that match your values.
            </span>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-900 text-white py-3 font-medium text-base rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
              asChild
            >
              <Link href={`/onboarding/resume?type=${userType}`}>Complete Profile Setup →</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
