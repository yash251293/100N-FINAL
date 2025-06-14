"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LinkIcon, BuildingIcon, UserIcon, BriefcaseIcon, GraduationCapIcon, MapPinIcon } from "lucide-react";
import { OnboardingStepper } from "@/components/onboarding-stepper";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/api";

// --- Zod Schema Definitions ---
const commonProfileSchema = z.object({
  location: z.string().optional(),
  linkedin_url: z.string().url({ message: "Invalid LinkedIn URL, e.g. https://linkedin.com/in/yourprofile" }).optional().or(z.literal('')),
  website_url: z.string().url({ message: "Invalid website URL, e.g. https://example.com" }).optional().or(z.literal('')),
  bio: z.string().max(1000, "Bio should not exceed 1000 characters.").optional(),
});

// REFACTORED: Added 'industry' to the individual schema to fix a bug.
const individualProfileSchema = commonProfileSchema.extend({
  full_name: z.string().min(1, "Full name is required."),
  professional_title: z.string().optional(),
  years_of_experience: z.string().optional(),
  job_function: z.string().optional(),
  key_skills: z.string().optional(), // Comma-separated
  education_level: z.string().optional(),
  field_of_study: z.string().optional(),
  institution: z.string().optional(),
  industry: z.string().optional(), // FIX: Added missing field
});

const companyProfileSchema = commonProfileSchema.extend({
  company_name: z.string().min(1, "Company name is required."),
  industry: z.string().optional(),
  company_size: z.string().optional(),
  company_type: z.string().optional(),
  tech_stack: z.string().optional(), // Comma-separated
});

// --- Type Definitions ---
type IndividualProfileValues = z.infer<typeof individualProfileSchema>;
type CompanyProfileValues = z.infer<typeof companyProfileSchema>;
type ProfileFormValues = IndividualProfileValues | CompanyProfileValues;


export default function ProfilePage() {
  const { user, token, isLoading: isAuthLoading, refetchUser } = useAuth();
  const router = useRouter();

  // The user type is now stable after the initial loading checks.
  const userType = user?.user_type;

  // Select the schema based on the final, stable userType.
  const currentSchema = userType === 'company' ? companyProfileSchema : individualProfileSchema;

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      // Default values are now populated reliably by the useEffect below.
    },
  });

  // useEffect to reset form with user-specific values when user data is available.
  useEffect(() => {
    if (user) {
      const defaultVals = {
        // Common fields
        location: user.profile?.location || "",
        linkedin_url: user.profile?.linkedin_url || "",
        website_url: user.profile?.website_url || "",
        bio: user.profile?.bio || "",
        industry: user.industry || user.profile?.industry || "",

        // Individual-specific fields
        full_name: userType === 'individual' ? user.full_name || "" : undefined,
        professional_title: userType === 'individual' ? user.profile?.professional_title || "" : undefined,
        years_of_experience: userType === 'individual' ? user.profile?.years_of_experience || "" : undefined,
        job_function: userType === 'individual' ? user.profile?.job_function || "" : undefined,
        key_skills: userType === 'individual' ? user.profile?.key_skills || "" : undefined,
        education_level: userType === 'individual' ? user.profile?.education_level || "" : undefined,
        field_of_study: userType === 'individual' ? user.profile?.field_of_study || "" : undefined,
        institution: userType === 'individual' ? user.profile?.institution || "" : undefined,
        
        // Company-specific fields
        company_name: userType === 'company' ? user.company_name || "" : undefined,
        company_size: userType === 'company' ? user.company_size || "" : undefined,
        company_type: userType === 'company' ? user.profile?.company_type || "" : undefined,
        tech_stack: userType === 'company' ? user.profile?.tech_stack || "" : undefined,
      };
      reset(defaultVals);
    }
  }, [user, userType, reset]);

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!token || !userType) {
      toast.error("Authentication error. Please log in again.");
      return;
    }
    try {
      // Use the current schema to parse the data. This ensures only fields
      // relevant to the user's type are included in the payload.
      const payload = currentSchema.parse(data);

      await updateUserProfile(payload, token);
      
      toast.success("Profile updated successfully!");
      await refetchUser(); // Refresh user context
      router.push(`/auth/onboarding/preferences`);

    } catch (error: any) {
      // Catches both Zod parsing errors and API errors
      const errorMessage = error.data?.message || error.message || "An unexpected error occurred.";
      toast.error(`Failed to update profile: ${errorMessage}`);
    }
  };

  // --- Conditional Returns for Loading and Auth State ---
  // These must come *after* all hooks are called.
  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || !userType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="mb-4">Could not determine user type. Please try logging in again.</p>
        <Button onClick={() => router.push('/auth/login')}>Go to Login</Button>
      </div>
    );
  }

  // --- Main Component Render ---
  return (
    <div className="min-h-screen bg-brand-bg-light-gray py-8">
      <OnboardingStepper />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-black to-gray-800 rounded-2xl shadow-lg mb-4">
            {userType === 'company' ? <BuildingIcon className="w-8 h-8 text-white" /> : <UserIcon className="w-8 h-8 text-white" />}
          </div>
          <h1 className="text-3xl font-bold text-brand-text-dark mb-3">
            {userType === 'company' ? 'Tell us about your company' : 'Tell us about yourself'}
          </h1>
          <p className="text-brand-text-medium leading-relaxed">
            {userType === 'company' ? 'Share your company details to find the right talent.' : 'Share your professional details to find amazing opportunities.'}
          </p>
        </div>

        {/* REFACTORED: Added a 'key' to the form. This is crucial.
            It forces React to create a new form instance (with the correct new resolver)
            when the userType changes, preventing stale validation schemas. */}
        <form key={userType} onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          
          {/* --- Common Sections (for both user types) --- */}
          
          <div className="space-y-5">
            <Label htmlFor="location" className="flex items-center space-x-2 text-base font-semibold text-brand-text-dark">
              <MapPinIcon className="h-5 w-5 text-black" />
              <span>{userType === 'company' ? 'Company Headquarters' : 'Your Location'}</span>
            </Label>
            <Input id="location" placeholder="e.g. San Francisco, CA or Remote" {...register("location")} className="bg-brand-bg-input border-brand-border focus:border-black" />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>

          <div className="border-t border-brand-border pt-8 space-y-6">
            <h2 className="flex items-center space-x-2 text-xl font-semibold text-brand-text-dark">
                <UserIcon className="h-5 w-5 text-black" />
                <span>{userType === 'company' ? 'Company Description' : 'Your Bio'}</span>
            </h2>
            <div>
                <Label htmlFor="bio" className="block text-base font-semibold text-brand-text-dark mb-3">
                    {userType === 'company' ? 'About your company...' : 'A short bio...'}
                </Label>
                <Textarea
                    id="bio"
                    placeholder={userType === 'company' ? 'Describe your mission, values, and culture...' : 'Share your professional journey, interests, or goals...'}
                    {...register("bio")}
                    className="bg-brand-bg-input border-brand-border min-h-[120px] focus:border-black"
                />
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
            </div>
          </div>

          {/* --- Dynamic Sections based on userType --- */}

          {userType === 'company' ? (
            <CompanyFields control={control} register={register} errors={errors as any} />
          ) : (
            <IndividualFields control={control} register={register} errors={errors as any} />
          )}

          {/* REFACTORED: Moved 'Online Presence' to be a single, common section to avoid code duplication. */}
          <div className="border-t border-brand-border pt-8 space-y-6">
            <h2 className="flex items-center space-x-2 text-xl font-semibold text-brand-text-dark">
              <LinkIcon className="h-5 w-5 text-black" />
              <span>Online Presence</span>
            </h2>
            <div className="space-y-6">
              <div>
                  <Label htmlFor="website_url" className="block text-base font-semibold text-brand-text-dark mb-2">
                    {userType === 'company' ? 'Company Website' : 'Personal Website/Portfolio'}
                  </Label>
                  <Input
                    id="website_url"
                    placeholder={userType === 'company' ? 'https://yourcompany.com' : 'https://yourportfolio.com'}
                    {...register("website_url")}
                    className="bg-brand-bg-input border-brand-border focus:border-black h-12"
                  />
                  {errors.website_url && <p className="text-red-500 text-xs mt-1">{errors.website_url.message}</p>}
              </div>
              <div>
                  <Label htmlFor="linkedin_url" className="block text-base font-semibold text-brand-text-dark mb-2">
                    {userType === 'company' ? 'LinkedIn Company Page' : 'LinkedIn Profile URL'}
                  </Label>
                  <Input
                    id="linkedin_url"
                    placeholder={userType === 'company' ? 'https://linkedin.com/company/yourcompany' : 'https://linkedin.com/in/yourprofile'}
                    {...register("linkedin_url")}
                    className="bg-brand-bg-input border-brand-border focus:border-black h-12"
                  />
                  {errors.linkedin_url && <p className="text-red-500 text-xs mt-1">{errors.linkedin_url.message}</p>}
              </div>
            </div>
          </div>


          <div className="pt-6">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-black hover:bg-gray-900 text-white py-3 font-medium text-base rounded-lg">
              {isSubmitting ? "Saving..." : "Save and Continue →"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


// --- Sub-components for Cleaner JSX ---

const CompanyFields = ({ control, register, errors }: { control: any, register: any, errors: any }) => (
  <>
    {/* Company Information */}
    <div className="border-t border-brand-border pt-8 space-y-6">
      <h2 className="flex items-center space-x-2 text-xl font-semibold text-brand-text-dark"><BuildingIcon className="h-5 w-5" /><span>Company Information</span></h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="company_name">Company Name <span className="text-brand-red">*</span></Label>
          <Input id="company_name" placeholder="Your Company Name" {...register("company_name")} className="mt-1 bg-brand-bg-input border-brand-border h-12" />
          {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
        </div>
        <div>
          <Label htmlFor="company_type">Company Type</Label>
          <Controller name="company_type" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full bg-brand-bg-input h-12"><SelectValue placeholder="Select company type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">🚀 Startup</SelectItem>
                <SelectItem value="enterprise">🏢 Enterprise</SelectItem>
                <SelectItem value="agency">🎯 Agency</SelectItem>
              </SelectContent>
            </Select>
          )} />
          {errors.company_type && <p className="text-red-500 text-xs mt-1">{errors.company_type.message}</p>}
        </div>
        <div>
          <Label htmlFor="company_size">Company Size</Label>
          <Controller name="company_size" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full bg-brand-bg-input h-12"><SelectValue placeholder="Select company size" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">👥 1-10 employees</SelectItem>
                <SelectItem value="11-50">👥 11-50 employees</SelectItem>
                <SelectItem value="51-200">👥 51-200 employees</SelectItem>
              </SelectContent>
            </Select>
          )} />
          {errors.company_size && <p className="text-red-500 text-xs mt-1">{errors.company_size.message}</p>}
        </div>
      </div>
    </div>
    {/* Industry & Focus */}
    <div className="border-t border-brand-border pt-8 space-y-6">
       <h2 className="flex items-center space-x-2 text-xl font-semibold text-brand-text-dark"><BriefcaseIcon className="h-5 w-5" /><span>Industry & Focus</span></h2>
       <div className="space-y-6">
          <div>
            <Label htmlFor="industry">Primary Industry</Label>
            <Controller name="industry" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ""}>
                    <SelectTrigger className="w-full bg-brand-bg-input h-12"><SelectValue placeholder="Select your industry" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tech">💻 Technology</SelectItem>
                        <SelectItem value="finance">💰 Finance</SelectItem>
                    </SelectContent>
                </Select>
            )} />
            {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
          </div>
          <div>
              <Label htmlFor="tech_stack">Tech Stack (Comma-separated)</Label>
              <Input id="tech_stack" placeholder="e.g., React, Node.js, Python" {...register("tech_stack")} className="bg-brand-bg-input border-brand-border h-12" />
              {errors.tech_stack && <p className="text-red-500 text-xs mt-1">{errors.tech_stack.message}</p>}
          </div>
       </div>
    </div>
  </>
);

const IndividualFields = ({ control, register, errors }: { control: any, register: any, errors: any }) => (
  <>
    {/* Personal Information */}
    <div className="border-t border-brand-border pt-8 space-y-6">
      <h2 className="flex items-center space-x-2 text-xl font-semibold text-brand-text-dark"><UserIcon className="h-5 w-5" /><span>Personal Information</span></h2>
      <div className="space-y-6">
          <div>
            <Label htmlFor="full_name">Full Name <span className="text-brand-red">*</span></Label>
            <Input id="full_name" placeholder="e.g. John Doe" {...register("full_name")} className="bg-brand-bg-input border-brand-border h-12" />
            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="professional_title">Professional Title</Label>
            <Input id="professional_title" placeholder="e.g. Senior Software Engineer" {...register("professional_title")} className="bg-brand-bg-input border-brand-border h-12" />
            {errors.professional_title && <p className="text-red-500 text-xs mt-1">{errors.professional_title.message}</p>}
          </div>
          <div>
            <Label htmlFor="years_of_experience">Years of Professional Experience</Label>
            <Controller name="years_of_experience" control={control} render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="w-full bg-brand-bg-input h-12"><SelectValue placeholder="Select your experience level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">🌱 0-1 years</SelectItem>
                  <SelectItem value="2-3">📈 2-3 years</SelectItem>
                  <SelectItem value="4-6">💼 4-6 years</SelectItem>
                  <SelectItem value="7-10">🚀 7-10 years</SelectItem>
                  <SelectItem value="10+">⭐ 10+ years</SelectItem>
                </SelectContent>
              </Select>
            )} />
            {errors.years_of_experience && <p className="text-red-500 text-xs mt-1">{errors.years_of_experience.message}</p>}
          </div>
      </div>
    </div>
    {/* Professional Background */}
    <div className="border-t border-brand-border pt-8 space-y-6">
      <h2 className="flex items-center space-x-2 text-xl font-semibold text-brand-text-dark"><BriefcaseIcon className="h-5 w-5" /><span>Professional Background</span></h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="industry">Primary Industry</Label>
          <Controller name="industry" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full bg-brand-bg-input h-12"><SelectValue placeholder="Select your primary industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="tech_individual">💻 Technology</SelectItem>
                <SelectItem value="consulting_individual">💡 Consulting</SelectItem>
              </SelectContent>
            </Select>
          )} />
          {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
        </div>
        <div>
          <Label htmlFor="job_function">Job Function</Label>
          <Controller name="job_function" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="w-full bg-brand-bg-input h-12"><SelectValue placeholder="Select your job function" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">⚙️ Engineering</SelectItem>
                  <SelectItem value="design">🎨 Design & UX</SelectItem>
                  <SelectItem value="product">📱 Product Management</SelectItem>
                </SelectContent>
            </Select>
          )} />
          {errors.job_function && <p className="text-red-500 text-xs mt-1">{errors.job_function.message}</p>}
        </div>
        <div>
          <Label htmlFor="key_skills">Key Skills (Comma-separated)</Label>
          <Input id="key_skills" placeholder="e.g., JavaScript, React, Python" {...register("key_skills")} className="bg-brand-bg-input border-brand-border h-12" />
          {errors.key_skills && <p className="text-red-500 text-xs mt-1">{errors.key_skills.message}</p>}
        </div>
      </div>
    </div>
    {/* Education */}
    <div className="border-t border-brand-border pt-8 space-y-6">
      <h2 className="flex items-center space-x-2 text-xl font-semibold text-brand-text-dark"><GraduationCapIcon className="h-5 w-5" /><span>Education</span></h2>
      <div className="space-y-6">
        <div>
          <Label htmlFor="education_level">Highest Education Level</Label>
          <Controller name="education_level" control={control} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="w-full bg-brand-bg-input h-12"><SelectValue placeholder="Select your education level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bachelors">🎓 Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">🎖️ Master's Degree</SelectItem>
                </SelectContent>
            </Select>
          )} />
          {errors.education_level && <p className="text-red-500 text-xs mt-1">{errors.education_level.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="field_of_study">Field of Study</Label>
            <Input id="field_of_study" placeholder="e.g. Computer Science" {...register("field_of_study")} className="bg-brand-bg-input border-brand-border h-12" />
            {errors.field_of_study && <p className="text-red-500 text-xs mt-1">{errors.field_of_study.message}</p>}
          </div>
          <div>
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" placeholder="e.g. Stanford University" {...register("institution")} className="bg-brand-bg-input border-brand-border h-12" />
            {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution.message}</p>}
          </div>
        </div>
      </div>
    </div>
  </>
);
