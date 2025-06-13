"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Logo is imported in the original but not used; can be removed or kept.
// For this version, I'll keep it as it was, but note it's not rendered.
import { Logo } from "@/components/logo";
import { ChromeIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUser, loginUser } from "@/lib/api"; // Import loginUser
import { toast } from "sonner"; // Import toast
import { useAuth } from "@/context/AuthContext"; // Import useAuth

// Zod schema (remains the same)
const formSchema = z.object({
  user_type: z.enum(["individual", "company"]),
  full_name: z.string().optional(), // Optional at base, required conditionally below
  company_name: z.string().optional(), // Optional at base, required conditionally below
  industry: z.string().optional(),
  company_size: z.string().optional(),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine(data => { // Conditional validation for full_name
    if (data.user_type === 'individual' && !data.full_name?.trim()) {
        return false;
    }
    return true;
}, {
    message: "Full name is required for individual users.",
    path: ["full_name"], // Path of error
}).refine(data => { // Conditional validation for company_name
    if (data.user_type === 'company' && !data.company_name?.trim()) {
        return false;
    }
    return true;
}, {
    message: "Company name is required for company users.",
    path: ["company_name"],
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Path of error
});

type SignUpFormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Removed apiError and apiSuccess states

  const router = useRouter();
  const searchParams = useSearchParams();
  const initialUserType = searchParams.get("type") === 'company' ? 'company' : 'individual';
  const { login } = useAuth(); // Get login from useAuth

  const { register, handleSubmit, watch, formState: { errors }, setValue, trigger } = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_type: initialUserType,
      email: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      company_name: "",
      industry: "",
      company_size: "",
    }
  });

  const userType = watch("user_type");

  useEffect(() => {
    setValue("user_type", initialUserType);
  }, [initialUserType, setValue]);

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
    setIsLoading(true);
    // Removed setApiError(null) and setApiSuccess(null);

    const { confirmPassword, ...apiData } = data;
    if (apiData.user_type === 'individual') {
        delete apiData.company_name;
        delete apiData.industry;
        delete apiData.company_size;
    } else {
        delete apiData.full_name;
    }

    try {
      const response = await registerUser(apiData); // Keep this
      console.log("Registration successful:", response);

      // Attempt to auto-login
      try {
        const loginResponse = await loginUser({ email: apiData.email, password: apiData.password });
        if (loginResponse && loginResponse.token && loginResponse.user) {
          login(loginResponse.token, loginResponse.user); // Update AuthContext
          toast.success("Registration successful! Redirecting to onboarding...");
          router.push('/auth/onboarding/verify-email'); // Redirect to onboarding
        } else {
          // This case means login failed silently or returned unexpected data
          toast.error("Registration successful, but auto-login failed. Please log in manually.");
          router.push('/auth/login');
        }
      } catch (loginError: any) {
        console.error("Auto-login after registration failed:", loginError);
        toast.error("Registration successful, but auto-login failed. Please log in manually: " + (loginError.data?.message || loginError.message));
        router.push('/auth/login');
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Ensure the error structure is checked before accessing nested properties
      const errorMessage = error.data?.message || error.message || "An unexpected error occurred during registration.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex w-full max-w-6xl mx-auto rounded-2xl shadow-xl overflow-hidden border">
        <div className="w-1/2 flex-col items-center justify-center bg-[#FFFCF6] p-12 hidden md:flex">
          <Image
            src="/imagex.png" // This image will be broken
            alt="Decorative Abstract Pattern"
            width={400}
            height={400}
            className="mb-10"
            priority
          />
          <h2 className="text-3xl font-black text-brand-text-dark text-left w-full mb-2" style={{fontFamily: 'Inter, sans-serif'}}>
              Where Connections Spark Opportunities
          </h2>
          <p className="text-lg text-brand-text-medium text-left w-full" style={{fontFamily: 'Inter, sans-serif'}}>
            Real roles. Real startups.
          </p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-white p-8 sm:p-12 min-h-full">
          <div className="mb-8 text-center">
            <span className="text-2xl font-black text-brand-text-dark" style={{fontFamily: 'Inter, sans-serif'}}>100</span>
            <span className="text-2xl font-black text-brand-blue ml-1" style={{fontFamily: 'Inter, sans-serif'}}>Networks</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-text-dark mb-6 text-center" style={{fontFamily: 'Inter, sans-serif'}}>Create Account</h1>

          <div className="flex justify-center space-x-2 sm:space-x-4 mb-6">
            <Button
              onClick={() => { setValue("user_type", "company"); trigger("user_type"); }}
              variant={userType === 'company' ? 'default' : 'outline'}
              className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium ${userType === 'company' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              For Company
            </Button>
            <Button
              onClick={() => { setValue("user_type", "individual"); trigger("user_type"); }}
              variant={userType === 'individual' ? 'default' : 'outline'}
              className={`px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-medium ${userType === 'individual' ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              For Individual
            </Button>
          </div>
          {errors.user_type && <p className="text-red-500 text-xs mt-1">{errors.user_type.message}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Conditional Fields for individual/company (same as before) */}
            {userType === 'individual' && (
              <div>
                <Label htmlFor="fullName" className="text-sm font-semibold text-brand-text-medium">Full Name</Label>
                <Input id="fullName" type="text" placeholder="Your Name" {...register("full_name")} className="mt-1 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-3 px-3 text-base"/>
                {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
              </div>
            )}
            {userType === 'company' && (
              <>
                <div>
                  <Label htmlFor="companyName" className="text-sm font-semibold text-brand-text-medium">Company Name</Label>
                  <Input id="companyName" type="text" placeholder="Your Company Name" {...register("company_name")} className="mt-1 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-3 px-3 text-base"/>
                  {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="industry" className="text-sm font-semibold text-brand-text-medium">Industry (Optional)</Label>
                  <Input id="industry" type="text" placeholder="e.g., Technology, Healthcare" {...register("industry")} className="mt-1 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-3 px-3 text-base"/>
                </div>
                <div>
                  <Label htmlFor="companySize" className="text-sm font-semibold text-brand-text-medium">Company Size (Optional)</Label>
                  <Input id="companySize" type="text" placeholder="e.g., 1-10 employees" {...register("company_size")} className="mt-1 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-3 px-3 text-base"/>
                </div>
              </>
            )}
            {/* Email, Password, Confirm Password fields (same as before) */}
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-brand-text-medium">Email</Label>
              <Input id="email" type="email" placeholder="example@gmail.com" {...register("email")} className="mt-1 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-3 px-3 text-base"/>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-semibold text-brand-text-medium">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••••" {...register("password")} className="mt-1 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-3 px-3 text-base"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-brand-text-medium hover:text-brand-blue">
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-brand-text-medium">Confirm Password</Label>
              <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="••••••••••" {...register("confirmPassword")} className="mt-1 bg-brand-bg-input border-brand-border placeholder-brand-text-light focus:border-brand-blue focus:ring-1 focus:ring-brand-blue py-3 px-3 text-base"/>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Removed direct rendering of apiError and apiSuccess */}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-brand-text-dark text-white py-3 font-bold text-base rounded-lg mt-2 shadow-md"
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <span className="text-sm font-bold text-brand-text-dark">Already have an account? </span>
            <Link href="/auth/login" className="font-bold text-brand-blue underline ml-1 text-sm">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
